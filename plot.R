source('results.R')

library(ggplot2)

r <- results_json('results-2.json')
df <- as.data.frame(r)

pdf('results.pdf', onefile = TRUE, width=11, height=8.5)
theme_set(theme_bw(base_size = 12) +
          theme(plot.margin = margin(t = 0.5, r = 0.5, b = 0.5, l = 0.5, unit = "in")))

print(
  ggplot(df, aes(type, ms, color=set)) +
    geom_boxplot(outlier.shape = NA) +
    geom_point(position = position_jitterdodge(), alpha=0.3) +
    labs(x = NULL, title = 'Initial Render Benchmark')
)

phases <- phases_data_frame(r)

print(
  ggplot(phases, aes(phase, ms, color=set)) +
    facet_wrap(~ type, scales="free_y") +
    geom_boxplot() +
    theme(strip.background = element_rect(fill = "#eeeeee")) +
    labs(title = 'Phase Durations')
)

pairs <- attr(r, 'pairs')
for (i in 1:nrow(pairs)) {
  pair <- pairs[i,]
  paired <- subset(df, set %in% pair & type == 'js')
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
      ", there is a %%%.18f probability of observing these samples",
      t$p.value * 100
    ),
    "\n(less than %5 is the convention for rejecting the null hypothesis).\n\n",
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
