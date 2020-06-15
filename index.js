(function() {
  var c = document.getElementById("canv");
  var $ = c.getContext("2d");
  var w = window.innerWidth;
  var h = window.innerHeight;
  var _w = window.innerWidth;
  var _h = window.innerHeight;
  c.width = window.innerWidth;
  c.height = window.innerHeight;
 
  var nw = 9;
  var nh = 5;
  var xd = _w / (nw - 1);
  var yd = _h / (nh - 1);
  var left = (w - _w) / 2;
  var top = (h - _h) / 2;
  var sp = 50;
  var rng = xd * 2;
  var grid = false;
  
  var img = new Image();
  img.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/131045/comic.jpg";
  
  function Pt(x, y) {
    this.x = x;
    this.px = x;
    this.y = y;
    this.py = y;
  }

  function Poly(top, left, xn, yn, xd, yd) {
    this.top = top;
    this.left = left;
    this.xd = xd;
    this.yd = yd;
    this.xn = xn;
    this.yn = yn;
    this.arr = [];
    this.pts = [];

    for (var ypt = 0; ypt < yn; ypt++) {
      for (var xpt = 0; xpt < xn; xpt++) {
        var _p_ = new Pt(left + xd * xpt, top + yd * ypt);
        this.pts.push(_p_);
      }
    }

    for (ypt = 0; ypt < yn - 1; ypt++) {
      for (xpt = 0; xpt < xn - 1; xpt++) {
        var pn0 = xpt + ypt * xn;
        var pn1 = (xpt + 1) + ypt * xn;
        var pn2 = xpt + (ypt + 1) * xn;
        var pn3 = xpt + 1 + (ypt + 1) * xn;

        this.arr.push(pn0);
        this.arr.push(pn1);
        this.arr.push(pn2);
        this.arr.push(pn3);
        this.arr.push(pn1);
        this.arr.push(pn2);
      }
    }

  }

  Poly.prototype.show = function() {
    this.$$.setTransform(1, 0, 0, 1, 0, 0);
    this.$$.strokeStyle = "hsla(0, 0%, 5% , 1)";
    this.$$.lineWidth = 3;
    for (var i = 0; i < this.arr.length; i += 3) {
      this.$$.beginPath();
      var pn1 = this.arr[i];
      var pn2 = this.arr[i + 1];
      var pn3 = this.arr[i + 2];

      this.$$.moveTo(this.pts[pn1].x, this.pts[pn1].y);
      this.$$.lineTo(this.pts[pn2].x, this.pts[pn2].y);
      this.$$.lineTo(this.pts[pn3].x, this.pts[pn3].y);
      this.$$.lineTo(this.pts[pn1].x, this.pts[pn1].y);
      this.$$.stroke();
      this.$$.closePath();
    }
  };

  Poly.prototype.trans = function() {
    var tot = this.arr.length;

    for (var i = 0; i < tot; i += 6) {
      var sn = i / 6
      var pn0 = this.arr[i];
      var pn1 = this.arr[i + 1];
      var pn2 = this.arr[i + 2];
      var pn3 = this.arr[i + 3];
      var pn4 = this.arr[i + 4];
      var pn5 = this.arr[i + 5];
      
      var p0 = this.pts[pn0];
      var p1 = this.pts[pn1];
      var p2 = this.pts[pn2];
      var p3 = this.pts[pn3];

      var dx = p0.x;
      var dy = p0.y;

      var pt1 = new Pt(p1.x - dx, p1.y - dy);
      var pt2 = new Pt(p2.x - dx, p2.y - dy);
      var pt3 = new Pt(p3.x - dx, p3.y - dy);

      var a0 = pt1.x / this.xd;
      var b0 = pt1.y / this.xd;
      var c0 = pt2.x / this.yd;
      var d0 = pt2.y / this.yd;

      var a1 = (pt3.x - pt2.x) / this.xd;
      var b1 = (pt3.y - pt2.y) / this.xd;
      var c1 = (pt3.x - pt1.x) / this.yd;
      var d1 = (pt3.y - pt1.y) / this.yd;
      var e1 = pt1.x + pt2.x - pt3.x;
      var f1 = pt1.y + pt2.y - pt3.y;

      this.$$.save();
      this.$$.beginPath();
      this.$$.moveTo(this.pts[pn0].x, this.pts[pn0].y);
      this.$$.lineTo(this.pts[pn1].x, this.pts[pn1].y);
      this.$$.lineTo(this.pts[pn2].x, this.pts[pn2].y);
      this.$$.closePath();
      this.$$.clip();

      this.$$.setTransform(a0, b0, c0, d0, dx, dy);
      this.$$.drawImage(this.image, sn % (this.xn - 1) * this.xd, ((sn / (this.xn - 1)) | 0) * this.yd, this.xd, this.yd, 0, 0, this.xd, this.yd);
      this.$$.restore();
      this.$$.save();
      this.$$.beginPath();
      this.$$.moveTo(this.pts[pn4].x, this.pts[pn4].y);
      this.$$.lineTo(this.pts[pn3].x, this.pts[pn3].y);
      this.$$.lineTo(this.pts[pn5].x, this.pts[pn5].y);
      this.$$.closePath();
      this.$$.clip();
      this.$$.setTransform(a1, b1, c1, d1, dx + e1, dy + f1);
      this.$$.drawImage(this.image, sn % (this.xn - 1) * this.xd, ((sn / (this.xn - 1)) | 0) * this.yd, this.xd, this.yd, 0, 0, this.xd, this.yd);
      this.$$.restore();
    }
  };

  function msp(_c, e) {
    var r = r = _c.getBoundingClientRect();
    return new Pt(e.clientX - r.left, e.clientY - r.top);
  }

  var imgpts = new Poly(top, left, nw, nh, xd, yd);
  imgpts.$$ = $;
  img.addEventListener("load", function(e) {
    imgpts.image = img;
    imgpts.trans();
    imgpts.show();

   window.addEventListener("mousedown", function(e) {
      grid = !grid;
      $.clearRect(0, 0, w, h);
      imgpts.trans();
      if (grid) imgpts.show();
    }, false);

    window.addEventListener("mousemove", function(e) {
      var ms = msp(c, e);
      var np = imgpts.pts.length;
      for (var i = 0; i < np; i++) {
        var p = imgpts.pts[i];
        var dx = ms.x - p.x;
        var dy = ms.y - p.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        p.x = (p.x - (dx / d) * (rng / d) * sp) - ((p.x - p.px) / 2);
        p.y = (p.y - (dy / d) * (rng / d) * sp) - ((p.y - p.py) / 2);
      }
      $.clearRect(0, 0, w, h);
      imgpts.trans();
      if (grid) imgpts.show();
    }, false);  
  }, false);
})();

window.addEventListener('resize',function(){
  if(c.width!==window.innerWidth){
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  }
});