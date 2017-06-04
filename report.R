suppressWarnings(suppressMessages(library(tidyjson)))
suppressWarnings(suppressMessages(library(dplyr)))

results <- read_json('results.json')
samples <- results %>%
  gather_array(column.name="set.id") %>%
  spread_values(set.name = jstring("set")) %>%
  enter_object("samples") %>%
  gather_array(column.name="set.iteration") %>%
  spread_values(µs = jnumber("duration")) %>%
  mutate(ms = µs / 1000)

samples$set.name = factor(samples$set.name)

set.levels <- levels(samples$set.name)
set.pairs <- t(combn(set.levels, 2))

for (i in 1:length(set.levels)) {
  cat("\n")
  ms <- filter(samples, set.name == set.levels[i])$ms
  h <- hist(ms, plot=F)
  for (row in max(h$count):1) {
    for (col in 1:length(h$count)) {
      if (h$count[col] >= row) {
        cat("\u2588\u2588")
      } else {
        cat("  ")
      }
    }
    cat("\n")
  }
  cat(set.levels[i], "samples\n\n")
  print(summary(ms))
  other <- c(mad(ms), length(ms))
  names(other) <- c("Median Abs. Deviation", "Sample Count")
  print(prettyNum(other), quote=F)
  cat("(durations are in milliseconds)\n\n\n");
}

for (i in 1:nrow(set.pairs)) {
  cat("\nTest ", set.pairs[i,1], " against ", set.pairs[i,2], "\n", sep="")
  paired <- filter(samples, set.name %in% set.pairs[i,])
  print(wilcox.test(ms ~ set.name, data=paired, conf.int=T))
  cat("\n")
}
