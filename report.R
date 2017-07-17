#!/usr/bin/env Rscript

argv <- commandArgs()

m <- grep("--file", argv)
srcDir <- if (m) dirname(substring(argv[m], 8)) else "."
srcDir <- normalizePath(srcDir)

m <- match("--args", argv, 0L)
argv <- if (m) argv[-seq_len(m)] else character()

json_filename <- if (length(argv) > 0) argv[1] else 'results.json'

suppressWarnings(suppressMessages(source(paste0(srcDir, '/ResultSets.R'))))

r <- ResultSets$new(json_filename)

printHistograms <- function(hists) {
  nrows <- max(sapply(hists, '[[', 'nrows'))
  for (r in max(nrows):1) {
    cat(paste("  ", sapply(hists, function (h) paste(sapply(1:h$ncols, function (c) {
      if (h$count[c] >= r) {
        "\u2588\u2588"
      } else {
        "  "
      }
    }), collapse="")), collapse = "    "))
    cat("\n")
  }
  cat(paste("  ", sapply(hists, function (x) format(x$type, justify='centre', width=x$ncols * 2)), collapse = "    "))
  cat("\n")
}

makeHistograms <- function(df, level) {
  lapply(levels(df$type), function (t) {
    ms <- subset(df, set == level & type == t)$ms
    h <- hist(ms, plot=F)
    list(type = t,
         count = h$count,
         nrows = max(h$count),
         ncols = length(h$count))
  });
}

s <- r$summary()

for (i in seq_len(nrow(r$meta))) {
  cat("\n")

  meta <- r$meta[i,]

  hists <- makeHistograms(r$samples, meta$set)

  printHistograms(hists)

  cat(paste0(meta$set, "\n"))
  cat(paste0(meta$count, " samples\n"))
  cat(paste0(meta$browser, "\n"))
  cat(paste0(meta$cpus, "\n\n"))
  print(s[meta$set,,])
}

pairs <- r$set.pairs
for (i in seq_len(nrow(pairs))) {
  pair <- pairs[i,]
  cat("\nTest ", pair[1], " against ", pair[2], "\n", sep="")
  paired <- subset(r$samples, set %in% pair & type == 'js')
  paired$set <- factor(paired$set, levels=pair)
  print(wilcox.test(ms ~ set, data=paired, conf.int=T))
}
