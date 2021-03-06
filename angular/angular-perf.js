// Change N to change the number of drawn circles.

var N = 100;


window.timeout = null;
window.totalTime = null;
window.loopCount = null;
window.reset = function() {
    $('#grid').empty();
    $('#timing').html('&nbsp;');
    clearTimeout(timeout);
    loopCount = 0;
    totalTime = 0;
};

window.benchmarkLoop = function(fn) {
    var startDate = new Date();
    fn();
    var endDate = new Date();
    totalTime += endDate - startDate;
    loopCount++;
    if (loopCount % 20 === 0) {
        $('#timing').text('Performed ' + loopCount + ' iterations in ' + totalTime + ' ms (average ' + (totalTime / loopCount).toFixed(2) + ' ms per loop).');
    }
    timeout = _.defer(benchmarkLoop, fn);
};

// The AngularJS implementation:
var animationApp = angular.module('animationApp', []);

angular.module("animationApp").controller("AnimationCtrl", function ($scope, $window, $rootScope) {
    var self = this;
    var start, counter = 0, totalTime = 0;
    $scope.count = 0;
    $scope.boxes = new Array();

    $scope.Box = function(n) {
        this.number = n;
        this.top = 0;
        this.left = 0;
        this.color = 0;
        this.content = 0;
        this.count = 0;

        this.tick = function() {
            var count = this.count += 1;
            this.top = Math.sin(count / 10) * 10;
            this.left = Math.cos(count / 10) * 10;
            this.color = count % 255;
            this.content = count % 100;
        }
    }

    $scope.angularjsInit = function() {
        for (var i = 0; i < N; i++) {
            $scope.boxes[i] = new $scope.Box(i);
        }
    }

    $scope.angularjsAnimate = function() {
        var startDate = new Date();
        for (var i = 0; i < N; i++) {
            $scope.boxes[i].tick();
        }
        $rootScope.$apply();
        var endDate = new Date();
        totalTime += endDate - startDate;
        counter += 1;
        if (counter % 20 === 0) {
          $('#timing').text('Performed ' + counter + ' iterations in ' + totalTime + ' ms (average ' + (totalTime / counter).toFixed(2) + ' ms per loop).');
        }
        $window.timeout = _.defer($scope.angularjsAnimate);
    }

    $scope.runAngularjs = function() {
        $scope.angularjsInit();
        $scope.angularjsAnimate();
    }
});


// Raw
(function(){

var BoxView = function(number){
    this.el = document.createElement('div');
    this.el.className = 'box-view';
    this.el.innerHTML = '<div class="box" id="box-' + number + '"></div>';
    this.count = 0;
    this.render()
}

BoxView.prototype.render = function(){
     var count = this.count
     var el = this.el.firstChild
     el.style.top = Math.sin(count / 10) * 10 + 'px';
     el.style.left = Math.cos(count / 10) * 10 + 'px';
     el.style.background = 'rgb(0,0,' + count % 255 + ')';
     el.textContent = String(count % 100);
}

BoxView.prototype.tick = function(){
    this.count++;
    this.render();
}

var boxes;

var init = function() {
    boxes = _.map(_.range(N), function(i) {
        var view = new BoxView(i);
        $('#grid').append(view.el);
        return view;
    });
};

var animate = function() {
    for (var i = 0, l = boxes.length; i < l; i++) {
      boxes[i].tick();
    }
};

window.runRawdog = function() {
    reset();
    init();
    benchmarkLoop(animate);
};

})();


