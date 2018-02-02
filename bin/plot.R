#!/usr/bin/env Rscript

argv <- commandArgs()

m <- grep("--file", argv)
srcDir <- if (m) dirname(substring(argv[m], 8)) else "."
srcDir <- normalizePath(srcDir)

m <- match("--args", argv, 0L)
argv <- if (m) argv[-seq_len(m)] else character()

json_filename <- if (length(argv) > 0) argv[1] else 'results.json'
pdf_filename <- paste0(sub("([^.]+)\\.[[:alnum:]]+$", "\\1", json_filename), '.pdf')

library(ggplot2)

source(paste0(srcDir, '/ResultSets.R'))

r <- ResultSets$new(json_filename)

pdf(pdf_filename, onefile = TRUE, width=11, height=8.5)
theme_set(theme_bw(base_size = 12) +
          theme(plot.margin = margin(t = 0.5, r = 0.5, b = 0.5, l = 0.5, unit = "in")))

print(
  ggplot(r$samples, aes(type, ms, color=set)) +
    geom_boxplot(outlier.shape = NA) +
    geom_point(position = position_jitterdodge(), alpha=0.3) +
    labs(x = NULL, title = 'Initial Render Benchmark')
)

print(
  ggplot(r$phases, aes(phase, ms, color=set)) +
    facet_wrap(~ type, scales="free_y") +
    geom_boxplot() +
    theme(strip.background = element_rect(fill = "#eeeeee"), axis.text.x = element_text(angle = 45, hjust=1)) +
    labs(title = 'Phase Durations')
)

if (!is.null(r$stats)) {
  library(dplyr)
  library(forcats)
  library(tidyr)

  plotStats <- function(df, title) {
    print(
      ggplot(df, aes(set, value)) +
        facet_wrap(~stat+metric, ncol=2, scales = "free", strip.position="left") +
        geom_boxplot(outlier.shape = NA) +
        geom_jitter(alpha=0.5, width=0.2, aes(color=set)) +
        coord_flip() +
        theme(
          axis.title = element_blank(),
          axis.text.y = element_blank(),
          axis.ticks.y = element_blank(),
          strip.text = element_text(size = 8)) +
        labs(title = title)
    )
  }

  filterLevels <- function(df, lvls) {
    df <- filter(df, stat %in% lvls)
    df$stat <- factor(df$stat, levels=lvls)
    df
  }

  pageStats <- function(df, title) {
    lvls <- levels(df$stat)
    len <- length(lvls)
    for (i in seq(1,len,by=5)) {
      plotStats(filterLevels(df, lvls[i:min(i+4, len)] ), title)
    }
  }

  df <- r$stats %>%
    group_by(set, group, sample) %>%
    summarise(count = sum(count), ms = sum(ms)) %>%
    rename(stat = group)
  df$stat <- fct_reorder(df$stat, df$ms, median, .desc = TRUE)

  df <- gather(df, metric, value, c(count, ms))

  pageStats(df, 'Runtime Stats by Group')

  df <- r$stats %>%
    group_by(set, stat, sample) %>%
    summarise(count = sum(count), ms = sum(ms))
  df$stat <- fct_reorder(df$stat, df$ms, median, .desc = TRUE)
  df <- gather(df, metric, value, c(count, ms))

  pageStats(df, 'Runtime Stat Detail')
}

pairs <- r$set.pairs
for (i in seq_len(nrow(pairs))) {
  pair <- pairs[i,]
  paired <- subset(r$samples, set %in% pair & type == 'js')
  paired$set <- factor(paired$set, levels=pair)
  paired.title <- paste("Test", pair[1], "JS Samples Against", pair[2], "JS Samples")
  t <- wilcox.test(ms ~ set, data=paired, conf.int=T)
  t.title = paste0(
    t$method, '\n\n',
    "If the true ",
    names(t$null.value),
    " were equal to ",
    t$null.value,
    sprintf(
      ", there is a %%%.2f chance of observing these samples:\n",
      t$p.value * 100
    ),
    "the result is statistically ",
    if (t$p.value < 0.05) "significant (less than %5" else "insignificant (%5 or greater",
    " chance of incorrectly rejecting the null hypothesis).\n\n",
    "Estimated ",
    names(t$estimate),
    sprintf(
      ' is %+.2fms, with a %%%1.f confidence it is between %+.2fms and %+.2fms.',
      t$estimate,
      attr(t$conf.int, 'conf.level') * 100,
      t$conf.int[1],
      t$conf.int[2]
    )
  )
  print(ggplot(paired, aes(set, ms)) +
    geom_boxplot(outlier.shape = NA) +
    geom_point(position = position_jitter(width=0.25), shape=16, alpha=0.3) +
    labs(title = paired.title, x = t.title) +
    theme(axis.title.x = element_text(hjust = 0, lineheight=1.3, margin=margin(t=12)))
  )
}

dev.off()
