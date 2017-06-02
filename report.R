suppressWarnings(suppressMessages(library(tidyjson)))
suppressWarnings(suppressMessages(library(tidyverse)))

results <- read_json('/Users/kselden/src/krisselden/chrome-tracing/results.json')
samples <- results %>%
  gather_array(column.name="set.id") %>%
  spread_values(set.name = jstring("set")) %>%
  enter_object("samples") %>%
  gather_array(column.name="set.iteration") %>%
  spread_values(µs = jnumber("duration")) %>%
  mutate(ms = µs / 1000)

samples$set.id        = factor(samples$set.id)
samples$set.name      = factor(samples$set.name)
samples$set.iteration = factor(samples$set.iteration)

set.levels <- levels(samples$set.name)
set.pairs <- t(combn(set.levels, 2))

for (i in 1:length(set.levels)) {
  cat(set.levels[i], "\n")
  print(summary(filter(samples, set.name == set.levels[i])$ms))
  cat("\n")
}

cat("\n")
for (i in 1:nrow(set.pairs)) {
  cat(set.pairs[i,1], "vs", set.pairs[i,2], "\n")
  paired <- filter(samples, set.name %in% set.pairs[i,])
  print(wilcox.test(ms ~ set.name, data=paired, conf.int=T))
}
