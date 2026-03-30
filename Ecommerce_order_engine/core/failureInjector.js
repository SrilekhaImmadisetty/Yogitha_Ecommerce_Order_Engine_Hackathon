class FailureInjector {
  shouldFail(probability = 0.2) {
    return Math.random() < probability;
  }
}

module.exports = new FailureInjector();