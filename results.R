suppressWarnings(suppressMessages(library(jsonlite)))

results_json <- function(path) {
  list <- fromJSON(file(path), simplifyVector=F)
  levels <- sapply(list, function (x) x$set)
  pairs <- t(combn(levels, 2))
  structure(list, class = c("results_json", class(list)), levels=levels, pairs=pairs)
}

as.data.frame.results_json <- function(results) {
  types <- c('duration', 'js')
  set <- c(sapply(results, function(result) {
    c(sapply(types, function (type) {
      replicate(length(result$samples), result$set)
    }))
  }))
  type <- c(sapply(results, function(result) {
    c(sapply(types, function (type) {
      replicate(length(result$samples), type)
    }))
  }))
  ms <- c(sapply(results, function(result) {
    c(sapply(types, function (type) {
      sapply(result$samples, function (x) x[[type]] / 1000)
    }))
  }))
  df <- data.frame(set, type, ms, stringsAsFactors=FALSE, row.names=NULL)
  df$set  <- factor(df$set,  levels=attr(results, 'levels'))
  df$type <- factor(df$type, levels=types)
  return(df)
}

printHistograms <- function(hists) {
  nrows <- max(sapply(hists, function(x) x$nrows))
  for (r in max(nrows):1) {
    cat(paste(sapply(hists, function (h) paste(sapply(1:h$ncols, function (c) {
      if (h$count[c] >= r) {
        "\u2588\u2588"
      } else {
        "  "
      }
    }), collapse="")), collapse = "  "))
    cat("\n")
  }
  cat(paste(sapply(hists, function (h) format(h$type, justify='centre', width=h$ncols * 2)), collapse = "  "))
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

summary.results_json <- function(obj) {
  df <- as.data.frame(obj)
  sets <- levels(df$set)
  types <- levels(df$type)
  array(c(sapply(sets, function (s) c(sapply(types, function (t) {
    ms <- subset(df, set == s & type == t)$ms
    ms.q <- quantile(ms, c(0.1, 0.25, 0.5, 0.75, 0.9), names=F)
    ms.iqr <- ms.q[4] - ms.q[2]
    ms.mad <- mad(ms)
    c(ms.q, ms.mad, ms.iqr)
  })))),
  dim=c(7, length(types), length(sets)),
  dimnames=list(ms=c('P10', 'Q1', 'Median', 'Q3', 'P90', 'MAD', 'IQR'), type=types, set=sets))
}

print.results_json <- function(obj) {
  df <- as.data.frame(obj)
  s <- summary(obj)
  for (i in 1:length(obj)) {
    level <- obj[[i]]$set
    meta <- obj[[i]]$meta
    cat("\n")

    hists <- makeHistograms(df, level)

    printHistograms(hists)

    cat(level, "\n")
    cat(length(subset(df, type == 'js' & set == level)$ms), "samples\n")
    cat("browser", meta$browserVersion, "\n")
    cat(length(meta$cpus), "cpus", meta$cpus[[1]], "\n")
    cat("\n")

    print(s[,,level], quote=F)
  }

  pairs <- attr(obj, 'pairs')
  for (i in 1:nrow(pairs)) {
    pair <- pairs[i,]
    cat("\nTest ", pair[1], " against ", pair[2], "\n", sep="")
    paired <- subset(df, set %in% pair & type == 'js')
    paired$set <- factor(paired$set, levels=pair)
    print(wilcox.test(ms ~ set, data=paired, conf.int=T))
  }
}
