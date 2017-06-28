suppressWarnings(suppressMessages(library(jsonlite)))

results_json <- function(path) {
  list <- fromJSON(file(path), simplifyVector=F)
  levels <- rev(sapply(list, function (x) x$set))
  pairs <- t(combn(levels, 2))
  structure(list, class = c("results_json", class(list)), levels=levels, pairs=pairs)
}

mapX <- function(...) {
  ARGV <- as.list(sys.call())
  X <- eval(ARGV[[2]], parent.frame())
  FUN <- as.function(append(alist(x=), ARGV[3]))
  sapply(X = X, FUN = FUN)
}

phases_data_frame <- function(results) {
  UseMethod("phases_data_frame")
}

phases_data_frame.results_json <- function(results) {
  phases <- mapX(results[[1]]$samples[[1]]$phases, x$phase)

  row.length <- sum(mapX(results, {
    sum(mapX(x$samples, {
      length(x$phases) * 2
    }))
  }))

  df <- data.frame(
    set  = character(row.length),
    phase = character(row.length),
    type = character(row.length),
    ms   = numeric(row.length),
    stringsAsFactors = FALSE,
    row.names = NULL)

  types <- c('self', 'cumulative')

  i = 1
  for (result in results) {
    for (sample in result$samples) {
      for (phase in sample$phases) {
        df$set[i]   <- result$set
        df$phase[i] <- phase$phase
        df$type[i]  <- 'self'
        df$ms[i]    <- phase$duration / 1000
        i <- i + 1
        df$set[i]   <- result$set
        df$phase[i] <- phase$phase
        df$type[i]  <- 'cumulative'
        df$ms[i]    <- (phase$start + phase$duration) / 1000
        i <- i + 1
      }
    }
  }

  df$set  <- factor(df$set,  levels=attr(results, 'levels'))
  df$phase <- factor(df$phase, levels=phases)
  df$type <- factor(df$type,
    levels=c('self', 'cumulative'),
    labels=c('Phase Self Time', 'Phase Cumulative Time'))
  return(df)
}

as.data.frame.results_json <- function(results) {
  types = c('duration', 'js')

  row.length <- sum(mapX(results, length(x$samples) * 2))

  df <- data.frame(
    set  = character(row.length),
    type = character(row.length),
    ms   = numeric(row.length),
    stringsAsFactors = FALSE,
    row.names = NULL)

  i = 1
  for (result in results) {
    for (sample in result$samples) {
      for (type in types) {
        df$set[i]  <- result$set
        df$type[i] <- type
        df$ms[i]   <- sample[[type]] / 1000
        i <- i + 1
      }
    }
  }

  df$set  <- factor(df$set,  levels = attr(results, 'levels'))
  df$type <- factor(df$type, levels = types)

  return(df)
}

printHistograms <- function(hists) {
  nrows <- max(mapX(hists, x$nrows))
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
  cat(paste(mapX(hists, format(x$type, justify='centre', width=x$ncols * 2)), collapse = "  "))
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
