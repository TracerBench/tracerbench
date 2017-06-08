suppressWarnings(suppressMessages(library(jsonlite)))

results_json <- function(path) {
  list <- fromJSON(file(path), simplifyVector=F)
  levels <- sapply(list, function (x) x$set)
  pairs <- t(combn(levels, 2))
  structure(list, class = c("results_json", class(list)), levels=levels, pairs=pairs)
}

as.data.frame.results_json <- function(obj, ...) {
  set <- unlist(lapply(obj, function(x) replicate(length(x$samples), x$set)), recursive = F)
  ms <- unlist(lapply(obj, function(x) sapply(x$samples, function (x) x$duration / 1000)), recursive=F)
  df <- data.frame(set, ms, stringsAsFactors=FALSE, row.names=NULL)
  df$set <- factor(df$set, levels=attr(obj, 'levels'))
  return(df)
}

print.results_json <- function(obj) {
  df <- as.data.frame(obj)
  for (i in 1:length(obj)) {
    level <- obj[[i]]$set
    meta <- obj[[i]]$meta
    cat("\n")
    ms <- subset(df, set == level)$ms
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
    cat(level, "\n")
    cat(length(ms), "samples\n")
    cat("browser", meta$browserVersion, "\n")
    cat(length(meta$cpus), "cpus", meta$cpus[[1]], "\n")
    cat("\n")
    q <- quantile(ms, c(0.1, 0.25, 0.5, 0.75, 0.9), names=F)
    sum <- c(q, mad(ms), q[4] - q[2])
    names(sum) <- c('P10', 'Q1', 'Median', 'Q3', 'P90', 'MAD', 'IQR')
    print(prettyNum(sum), quote=F)
  }

  pairs <- attr(obj, 'pairs')
  for (i in 1:nrow(pairs)) {
    pair <- pairs[i,]
    cat("\nTest ", pair[1], " against ", pair[2], "\n", sep="")
    paired <- subset(df, set %in% pair)
    paired$set <- factor(paired$set, levels=pair)
    print(wilcox.test(ms ~ set, data=paired, conf.int=T))
  }
}
