#!/usr/bin/env Rscript

argv <- commandArgs()

m <- grep("--file", argv)
srcDir <- if (m) dirname(substring(argv[m], 8)) else "."
srcDir <- normalizePath(srcDir)

m <- match("--args", argv, 0L)
argv <- if (m) argv[-seq_len(m)] else character()

json_filename <- if (length(argv) > 0) argv[1] else 'results.json'
pdf_filename <- paste0(sub("([^.]+)\\.[[:alnum:]]+$", "\\1", json_filename), '-stats.pdf')

library(ggplot2)

source(paste0(srcDir, '/ResultSets.R'))

r <- ResultSets$new(json_filename)

pdf(pdf_filename, onefile = TRUE, width=11, height=8.5)
theme_set(theme_bw(base_size = 12) +
          theme(plot.margin = margin(t = 0.5, r = 0.5, b = 0.5, l = 0.5, unit = "in")))

suppressMessages(library(dplyr))
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
    plotStats(filterLevels(df, lvls[i:min(i+4, len)] ), paste(title, '(', floor((i + 5)/5), 'of', floor(len/5), ')'))
  }
}

df <- r$stats %>%
  group_by(set, group, sample) %>%
  summarise(count = sum(count), ms = sum(ms)) %>%
  rename(stat = group)
df$stat <- fct_reorder(df$stat, df$ms, median, .desc = TRUE)

df <- gather(df, metric, value, c(count, ms))

pageStats(df, 'Groups')

df <- r$stats %>%
  group_by(set, stat, sample) %>%
  summarise(count = sum(count), ms = sum(ms))
df$stat <- fct_reorder(df$stat, df$ms, median, .desc = TRUE)
df <- gather(df, metric, value, c(count, ms))

pageStats(df, 'Details')

dev.off()

