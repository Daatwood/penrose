export default function penrose(canvas, offset, kiteColor, kiteColorInvert, dartColor, dartColorInvert) {
  tile_floor(canvas, offset, kiteColor, kiteColorInvert, dartColor, dartColorInvert)
}

// src: https://dglittle.github.io/cdn/edit003.html#penrose007.html
function tile_floor(c, offset, kiteColor, kiteColorInvert, dartColor, dartColorInvert) {
  let dpr = window.devicePixelRatio;

  offset = [offset[0] * dpr, offset[1] * dpr]
  
  var g = c.getContext('2d')
  
  g.fillStyle = 'rgba(255, 0, 255, 1)'
  g.fillRect(0, 0, c.width, c.height)
  
  var r = Math.sqrt(Math.pow(c.width/2, 2) + Math.pow(c.height/2, 2))
  //var r = Math.min(c.width, c.height) / 2
  var gap = r*2/30
  var center = [c.width/2, c.height/2]

  // var rr = 0.6021310716578796 // Math.random() // -0.8013333924608401
  // var rr = Math.random()
  var rr = 0.2
  // var rr = 0.45637382882929
  console.log('rr: ' + rr)
  var perterb = rr * -gap
  
  var es = []
  for (var angle = 0; angle < Math.PI*2; angle += Math.PI*2/5) {
      es.push([-Math.sin(angle), Math.cos(angle), perterb])
  }
  
  var liness = []
  each(es, function (e) {
      var lines = []
      liness.push(lines)
      
      // g.beginPath()
      var M = [e[1], -e[0], e[0], e[1]]
      
      var pert = -(dot(e, offset)%gap) + e[2]
  
      for (var y = -r + pert; y <= r; y += gap) {
          var a = [-r, y]
          var b = [r, y]
  
          a = trans(a, M)
          b = trans(b, M)
          a = add(a, center)
          b = add(b, center)
          
          lines.push([a, b])
          
          // g.moveTo(a[0], a[1])
          // g.lineTo(b[0], b[1])
      }
      // g.strokeStyle = 'black'
      // g.stroke()
  })
  
  function create_point_set() {
      var self = {}
      self.point_set = {}
      self.add = function (a) {
          self.point_set[Math.round(a[0] * 1000000) + ',' + Math.round(a[1] * 1000000)] = true
      }
      self.ask = function (a) {
          for (var y = -1; y <= 1; y++) {
              for (var x = -1; x <= 1; x++) {
                  var key = (Math.round(a[0] * 1000000) + x) + ',' + (Math.round(a[1] * 1000000) + y)
                  if (self.point_set[key]) return true
              }
          }
      }
      return self
  }
  
  var point_set = create_point_set()
  var thin_rhombs = []
  
  for (var i = 0; i < liness.length; i++) {
      for (var ii = i + 1; ii < liness.length; ii++) {
          var lines_a = liness[i]
          var lines_b = liness[ii]
          for (var ai = 0; ai < lines_a.length; ai++) {
              for (var bi = 0; bi < lines_b.length; bi++) {
                  var a = lines_a[ai]
                  var b = lines_b[bi]
                  var r = line_intersect(a[0][0], a[0][1], a[1][0], a[1][1], b[0][0], b[0][1], b[1][0], b[1][1])
                  if (r.seg1 && r.seg2) {
                      // g.fillStyle = 'red'
                      // g.fillRect(r.x, r.y, 3, 3)
                      
                      var e_scale = 0.4
                      var corners = [[0, 0], [0, 0], [0, 0], [0, 0]]
                      for (var ei = 0; ei < es.length; ei++) {
                          var e = es[ei]
                          var iii = (dot(e, add(sub([r.x, r.y], center), offset)) - e[2]) / gap
                          
                          if (ei == i) {
                              iii = Math.round(iii)
                              corners[0] = add(corners[0], mul(e, iii * gap * e_scale))
                              corners[1] = add(corners[1], mul(e, iii * gap * e_scale))
                              iii -= 1
                              corners[2] = add(corners[2], mul(e, iii * gap * e_scale))
                              corners[3] = add(corners[3], mul(e, iii * gap * e_scale))
                          } else if (ei == ii) {
                              iii = Math.round(iii)
                              corners[0] = add(corners[0], mul(e, iii * gap * e_scale))
                              corners[2] = add(corners[2], mul(e, iii * gap * e_scale))
                              iii -= 1
                              corners[1] = add(corners[1], mul(e, iii * gap * e_scale))
                              corners[3] = add(corners[3], mul(e, iii * gap * e_scale))
                          } else {
                              iii = Math.floor(iii)
                              for (var cc = 0; cc < 4; cc++) {
                                  corners[cc] = add(corners[cc], mul(e, iii * gap * e_scale))
                              }
                          }
                      }
                      each(corners, function (c, i) {
                          corners[i] = add(sub(c, offset), center)
                      })
  
                      var save = corners[1]
                      corners[1] = corners[0]
                      corners[0] = save
  
                      var diff = ((i - ii) + 5) % 5
                      if (diff == 2 || diff == 3) {
                          // drawPoly(g, corners, 'rgba(0, 128, 255, 0.5)')
                          
                          thin_rhombs.push(corners)
                      } else {
                          // drawPoly(g, corners, 'rgba(255, 255, 0, 0.5)')
                          
                          each(corners, function (c) {
                              point_set.add(c)
                          })
                      }
                      
                      // iiii++
                      // if (iiii >= 1200)
                      //     throw 'blah'
                  }
              }
          }
      }
  }
  
  var kites = create_point_set()
  
  each(thin_rhombs, function (t, i) {
      function to_rhomb(x) {
          var a = sub(t[2], t[0])
          a = trans(x, [a[0], a[1], -a[1], a[0]])
          return add(a, t[0])
      }
      
      
      
      
              // var color = ''
              // if (Math.random() < 0.3333) {
              //     if (Math.random() < 0.5) {
              //         color = 'rgba(255, ' + Math.floor(256 * Math.random()) + ', 0, 1)'
              //     } else {
              //         color = 'rgba(255, 0, ' + Math.floor(256 * Math.random()) + ', 1)'
              //     }
              // } else if (Math.random() < 0.5) {
              //     if (Math.random() < 0.5) {
              //         color = 'rgba(' + Math.floor(256 * Math.random()) + ', 255, 0, 1)'
              //     } else {
              //         color = 'rgba(0, 255, ' + Math.floor(256 * Math.random()) + ', 1)'
              //     }
              // } else {
              //     if (Math.random() < 0.5) {
              //         color = 'rgba(' + Math.floor(256 * Math.random()) + ', 0, 255, 1)'
              //     } else {
              //         color = 'rgba(0, ' + Math.floor(256 * Math.random()) + ', 255, 1)'
              //     }
              // }
              


      
      
      
      var a = to_rhomb([.5, .5 * Math.tan(54/360*Math.PI*2)])
      if (point_set.ask(a)) {
          var further = null
          if (distSq(t[1], a) > distSq(t[3], a)) {
              t[3] = a
              further = t[1]
          } else {
              t[1] = a
              further = t[3]
          }
          drawPoly(g, t, kiteColor)
  
          var dx = .5 * Math.sin(36/360*Math.PI*2)/Math.cos(18/360*Math.PI*2)
          if (point_set.ask(to_rhomb([.5 - dx, -.5*Math.cos(36/360*Math.PI*2)/Math.cos(18/360*Math.PI*2) - .5*Math.sin(18/360*Math.PI*2)/Math.cos(18/360*Math.PI*2)]))) {
              if (!kites.ask(t[0])) {
                  kites.add(t[0])
                  
                  var v = [.5*Math.cos(54/360*Math.PI*2)/Math.cos(18/360*Math.PI*2), .5*Math.sin(54/360*Math.PI*2)/Math.cos(18/360*Math.PI*2)]
                  var p = [t[0], further, to_rhomb([-v[0], -v[1]]), to_rhomb([-v[0], v[1]])]
                  drawPoly(g, p, dartColor)
              }
          }
          if (point_set.ask(to_rhomb([.5 + dx, -.5*Math.cos(36/360*Math.PI*2)/Math.cos(18/360*Math.PI*2) - .5*Math.sin(18/360*Math.PI*2)/Math.cos(18/360*Math.PI*2)]))) {
              if (!kites.ask(t[2])) {
                  kites.add(t[2])
                  
                  var v = [1 + .5*Math.cos(54/360*Math.PI*2)/Math.cos(18/360*Math.PI*2), .5*Math.sin(54/360*Math.PI*2)/Math.cos(18/360*Math.PI*2)]
                  var p = [t[2], further, to_rhomb([v[0], -v[1]]), to_rhomb([v[0], v[1]])]
                  drawPoly(g, p, dartColorInvert)
              }
          }
          
      } else {
          var a = to_rhomb([.5, -.5 * Math.tan(54/360*Math.PI*2)])
          if (point_set.ask(a)) {
              var further = null
              if (distSq(t[1], a) > distSq(t[3], a)) {
                  t[3] = a
                  further = t[1]
              } else {
                  t[1] = a
                  further = t[3]
              }

              drawPoly(g, t, kiteColorInvert)
              
              var dx = .5 * Math.sin(36/360*Math.PI*2)/Math.cos(18/360*Math.PI*2)
              if (point_set.ask(to_rhomb([.5 - dx, .5*Math.cos(36/360*Math.PI*2)/Math.cos(18/360*Math.PI*2) + .5*Math.sin(18/360*Math.PI*2)/Math.cos(18/360*Math.PI*2)]))) {
                  if (!kites.ask(t[0])) {
                      kites.add(t[0])
                      
                      var v = [.5*Math.cos(54/360*Math.PI*2)/Math.cos(18/360*Math.PI*2), .5*Math.sin(54/360*Math.PI*2)/Math.cos(18/360*Math.PI*2)]
                      var p = [t[0], further, to_rhomb([-v[0], v[1]]), to_rhomb([-v[0], -v[1]])]
                      drawPoly(g, p, dartColor)
                  }
              }
              if (point_set.ask(to_rhomb([.5 + dx, .5*Math.cos(36/360*Math.PI*2)/Math.cos(18/360*Math.PI*2) + .5*Math.sin(18/360*Math.PI*2)/Math.cos(18/360*Math.PI*2)]))) {
                  if (!kites.ask(t[2])) {
                      kites.add(t[2])
                      
                      var v = [1 + .5*Math.cos(54/360*Math.PI*2)/Math.cos(18/360*Math.PI*2), .5*Math.sin(54/360*Math.PI*2)/Math.cos(18/360*Math.PI*2)]
                      var p = [t[2], further, to_rhomb([v[0], v[1]]), to_rhomb([v[0], -v[1]])]
                      drawPoly(g, p, dartColorInvert)
                  }
              }
          }
      }
  })
}

// Helper function

var each = function (o, cb) {
	if (o instanceof Array) {
		for (var i = 0; i < o.length; i++) {
			if (cb(o[i], i, o) == false)
				return false
		}
	} else {
		for (var k in o) {
			if (o.hasOwnProperty(k)) {
				if (cb(o[k], k, o) == false)
					return false
			}
		}
	}
	return true
}

// Helper functions

function distSq(a, b) {
  var x = sub(a, b)
  return dot(x, x)
}

function mul(a, b) {
  return [a[0] * b, a[1] * b]
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1]
}

function sub(a, b) {
  return [a[0] - b[0], a[1] - b[1]]
}

function add(a, b) {
  return [a[0] + b[0], a[1] + b[1]]
}

function trans(a, B) {
  return [a[0] * B[0] + a[1] * B[2], a[0] * B[1] + a[1] * B[3]]
}

// https://stackoverflow.com/questions/13937782/calculating-the-point-of-intersection-of-two-lines
function line_intersect(x1, y1, x2, y2, x3, y3, x4, y4)
{
  var ua, ub, denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
  if (denom == 0) {
      return null;
  }
  ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3))/denom;
  ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3))/denom;
  return {
      x: x1 + ua*(x2 - x1),
      y: y1 + ua*(y2 - y1),
      seg1: ua >= 0 && ua <= 1,
      seg2: ub >= 0 && ub <= 1
  };
}

function drawPoly(g, p, color) {
  g.beginPath()
  each(p, function (v, i) {
      if (i == 0) g.moveTo(v[0], v[1])
      else g.lineTo(v[0], v[1])
  })
  g.lineTo(p[0][0], p[0][1])
  g.strokeStyle = 'white'
  g.fillStyle = color
  g.fill()
  g.stroke()
}

function drawPolyNoBorder(g, p, color) {
  g.beginPath()
  each(p, function (v, i) {
      if (i == 0) g.moveTo(v[0], v[1])
      else g.lineTo(v[0], v[1])
  })
  g.lineTo(p[0][0], p[0][1])
  g.fillStyle = color
  g.fill()
}

function cap(t, mi, ma) {
  if (t < mi) return mi
  if (t > ma) return ma
  return t
}

function lerp(t0, v0, t1, v1, t) {
  return (t - t0) * (v1 - v0) / (t1 - t0) + v0
}

function getPos(e) {
  var x = 0, y = 0
  while (e != null) {
      x += e.offsetLeft
      y += e.offsetTop
      e = e.offsetParent
  }
  return {x : x, y : x}
}

function getRelPos(to, positionedObject) {
  var pos = getPos(to)
  return {
      x : positionedObject.pageX - pos.x,
      y : positionedObject.pageY - pos.y
  }
}
