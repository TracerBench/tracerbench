source('results.R')

r <- results_json('results.json')
df <- as.data.frame(r)

library(ggplot2)

ggplot(df, aes(ms, type, color=set)) + geom_boxplot()
