angular.module('sraSearchApp').filter('joinKeys', function () {
  return function (input, delimiter) {
    return input.join(delimiter);
  };
});