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
