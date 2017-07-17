library(R6)
library(jsonlite)

Cursor <- R6Class("Cursor",
  portable = F,
  cloneable = F,
  public = list(
    type = NULL,
    length = 0,
    initialize = function(type, length) {
      type <<- type
      length <<- length
      vec <<- vector(type, length)
      lockBinding('type', self)
      lockBinding('length', self)
    },
    write = function (value) {
      if (typeof(value) != type) stop(paste('expected value to be', type, 'but was', typeof(value)))
      if (length == i) stop(paste('vector is fully written', length))
      do_write(value)
    },
    as.vector = function (...) {
      if (i < length) stop(paste('vector is not fully written: pos', i, 'length', length))
      vec
    }
  ),
  private = list(
    i = 0,
    vec = NULL,
    do_write = function(value) {
      i <<- i + 1
      vec[i] <<- value
    }
  )
)

as.vector.Cursor <- function (c, ...) c$as.vector()

ResultSets <- R6Class("ResultSets",
  portable = F,
  cloneable = F,
  public = list(
    path = NULL,
    meta = NULL,
    samples = NULL,
    phases = NULL,
    set.levels = NULL,
    set.pairs = NULL,
    sample.count = NULL,
    phase.levels = NULL,
    stats = NULL,
    initialize = function(path = "results.json") {
      path <<- path
      json <- fromJSON(file(path), simplifyVector = F)
      json <- rev(json)
      meta <<- build_meta(json)
      set.levels <<- levels(meta$set)
      set.pairs <<- t(combn(set.levels, 2))
      sample.count <<- sum(meta$count)
      samples <<- build_samples(json)
      phases <<- build_phases(json)
      stats <<- build_runtime_call_stats(json)
    },
    summary = function() {
      s <- xtabs(ms ~ ., aggregate(ms ~ set + type, samples, function (ms) {
        ms.q <- quantile(ms, c(0.1, 0.25, 0.5, 0.75, 0.9), names=F)
        ms.iqr <- ms.q[4] - ms.q[2]
        ms.mad <- mad(ms)
        ms <- c(ms.q, ms.mad, ms.iqr)
        names(ms) <- c('P10', 'Q1', 'Median', 'Q3', 'P90', 'MAD', 'IQR')
        ms
      }))
      names(dimnames(s)) <- c("set", "type", "ms")
      s
    }
  ),
  private = list(
    build_meta = function(json) {
      cursors <- lapply(list(
        set = "character",
        browser = "character",
        cpus = "character",
        count = "integer"
      ), Cursor$new, length(json))

      for (result in json) {
        cursors$set$write( result$set )
        cursors$browser$write( result$meta$browserVersion )
        cursors$cpus$write( cpus_str(result$meta) )
        cursors$count$write( length(result$samples) )
      }

      data <- lapply(cursors, as.vector)
      data$set <- factor(data$set, levels = data$set)
      data.frame(data)
    },
    cpus_str = function (meta) {
      cpus <- table(unlist(meta$cpus))
      paste(mapply(
        paste,
        cpus,
        dimnames(cpus),
        sep = " x "
      ), collapse = " ")
    },
    build_samples = function (json) {
      n <- sample.count * 2

      cursors <- lapply(list(
        set="character",
        sample="integer",
        type="character",
        ms="double"
      ), Cursor$new, n )

      for (result in json) {
        samples <- result$samples
        for (i in seq_len(length(samples))) {
          sample <- samples[[i]]
          cursors$set$write(result$set)
          cursors$sample$write(i)
          cursors$type$write("js")
          cursors$ms$write(sample$js / 1000)

          cursors$set$write(result$set)
          cursors$sample$write(i)
          cursors$type$write("duration")
          cursors$ms$write(sample$duration / 1000)
        }
      }

      data <- lapply(cursors, as.vector)
      data$set <- factor(data$set, levels = set.levels)
      data.frame(data)
    },
    build_phases = function (json) {
      phase.levels <<- sapply(json[[1]]$samples[[1]]$phases, '[[', 'phase')
      n <- sample.count * 2 * length(phase.levels)

      cursors <- lapply(list(
        set = "character",
        phase = "character",
        sample = "integer",
        type = "character",
        ms = "double"
      ), Cursor$new, n)

      for (result in json) {
        samples <- result$samples
        for (i in seq_len(length(samples))) {
          sample <- samples[[i]]
          for (phase in sample$phases) {
            cursors$set$write(result$set)
            cursors$sample$write(i)
            cursors$phase$write(phase$phase)
            cursors$type$write("self")
            cursors$ms$write(phase$duration / 1000)

            cursors$set$write(result$set)
            cursors$sample$write(i)
            cursors$phase$write(phase$phase)
            cursors$type$write("cumulative")
            cursors$ms$write((phase$start + phase$duration) / 1000)
          }
        }
      }

      data <- lapply(cursors, as.vector)
      data$set <- factor(data$set, levels = set.levels)
      data$phase <- factor(data$phase, levels = phase.levels)
      data.frame(data)
    },
    build_runtime_call_stats = function (json) {
      if (is.null(json[[1]]$samples[[1]]$runtimeCallStats)) {
        return(NULL)
      }

      n <- 0
      for (result in json) {
        for (sample in result$samples) {
          for (group in sample$runtimeCallStats) {
            n <- n + length(group)
          }
        }
      }

      cursors <- lapply(list(
        set = "character",
        sample = "integer",
        group = "character",
        stat = "character",
        count = "integer",
        ms = "double"
      ), Cursor$new, n)

      for (result in json) {
        samples <- result$samples
        for (i in seq_len(length(samples))) {
          groups <- samples[[i]]$runtimeCallStats
          for (groupName in names(groups)) {
            group <- groups[[groupName]]
            for (name in names(group)) {
              stat <- group[[name]]
              cursors$set$write( result$set )
              cursors$sample$write( i )
              cursors$group$write( groupName )
              cursors$stat$write( name )
              cursors$count$write( stat$count )
              cursors$ms$write( stat$time / 1000 )
            }
          }
        }
      }

      data <- lapply(cursors, as.vector)
      data$set <- factor(data$set, levels = set.levels)
      data.frame(data)
    }
  )
)
