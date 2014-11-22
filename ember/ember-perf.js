// Change N to change the number of drawn circles.

var N = 100;

// The Ember implementation:
(function(){

var Box = Ember.Object.extend({

    top: 0,
    left: 0,
    content: 0,
    count: 0,

    tick: function() {
        var count = this.get('count') + 1;
        this.set('count', count);
        this.set('top', Math.sin(count / 10) * 10);
        this.set('left', Math.cos(count / 10) * 10);
        this.set('color', count % 255);
        this.set('content', count % 100);
        this.set('style', this.computeStyle());
    },

    computeStyle: function() {
        return 'top: ' + this.get('top') + 'px; left: ' +  this.get('left') +'px; background: rgb(0,0,' + this.get('color') + ');';
    }

});

var htmlbarsTemplate = Ember.Handlebars.compile($('#handlebars-box').text().trim());

var BoxView = Ember.View.extend({
    template: htmlbarsTemplate,
    // templateName: "box",
    classNames: ['box-view']
});

var boxes;
// var App = Ember.Application.create();

var emberInit = function() {
    boxes = _.map(_.range(N), function(i) {
        var box = Box.create();
        var view = BoxView.create({context: box});
        view.appendTo('#grid');
        box.set('number', i);
        console.log('view', view);
        return box;
    });
    console.log("boxes", boxes);
};

var emberAnimate = function() {
    Ember.run(function() {
        for (var i = 0, l = boxes.length; i < l; i++) {
          boxes[i].tick();
        }
    });
};

window.runEmber = function() {
    reset();
    emberInit();
    benchmarkLoop(emberAnimate);
};

})();
// Ember end




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

