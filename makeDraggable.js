function makeDraggable(evt) {

  // get the event target
  var svg = evt.target;

  // bind eventlisteners to the svg the user is interacting with
  // need three functions
  // when drag started do X
  // when dragging do Y
  // when drag finished do Z
  svg.addEventListener('mousedown', startDrag);
  svg.addEventListener('mousemove', drag);
  svg.addEventListener('mouseup', endDrag);
  svg.addEventListener('mouseleave', endDrag);
  svg.addEventListener('touchstart', startDrag);
  svg.addEventListener('touchmove', drag);
  svg.addEventListener('touchend', endDrag);
  svg.addEventListener('touchleave', endDrag);
  svg.addEventListener('touchcancel', endDrag);

  var selectedElement, offset, transform,
    bbox, minX, maxX, minY, maxY, confined;

  // create bounding box to confine the drag and drop area (to just the workspace),
  // or like how blocks cannot be dragged inside the toolbox
  var boundaryX1 = 10.5;
  var boundaryX2 = 30;
  var boundaryY1 = 2.2;
  var boundaryY2 = 19.2;

  // convert from screen coordinate system to SVG [a,b,c,d,e,f]
  // this positions the corner of the rectangle where your mouse is
  // so we need to use this to calculate the mouse offset in startDrag
  function getMousePosition(evt) {
    var CTM = svg.getScreenCTM();
    // working on mobile consideration
    if (evt.touches) { evt = evt.touches[0]; }
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d
    };
  }

  function startDrag(evt) {
    // if the event target svg is allowed to be dragged then set selected element to event target
    // this means that svgs of class static cannot be draggeed
    if (evt.target.classList.contains('draggable')) {
      selectedElement = evt.target;
      offset = getMousePosition(evt);

      // Make sure the first transform on the element is a translate transform
      var transforms = selectedElement.transform.baseVal;

      if (transforms.length === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
        // Create an transform that translates by (0, 0)
        var translate = svg.createSVGTransform();
        translate.setTranslate(0, 0);
        selectedElement.transform.baseVal.insertItemBefore(translate, 0);
      }

      // Get initial translation
      transform = transforms.getItem(0);
      offset.x -= transform.matrix.e;
      offset.y -= transform.matrix.f;



      // using the class confied, set the boundaries of the svg movement
      confined = evt.target.classList.contains('confine');
      if (confined) {
        bbox = selectedElement.getBBox();
        minX = boundaryX1 - bbox.x;
        maxX = boundaryX2 - bbox.x - bbox.width;
        minY = boundaryY1 - bbox.y;
        maxY = boundaryY2 - bbox.y - bbox.height;
      }
    }
  }

  function drag(evt) {
    if (selectedElement) {
      evt.preventDefault();

      var coord = getMousePosition(evt);
      var dx = coord.x - offset.x;
      var dy = coord.y - offset.y;

      if (confined) {
        if (dx < minX) { dx = minX; }
        else if (dx > maxX) { dx = maxX; }
        if (dy < minY) { dy = minY; }
        else if (dy > maxY) { dy = maxY; }
      }

      transform.setTranslate(dx, dy);
    }
  }

  // remove event target so we stop dragging once mouse released
  function endDrag(evt) {
    selectedElement = false;

    var r1 = evt.target.getBoundingClientRect();
    var r2 = document.getElementById('workspace').getBoundingClientRect()

    if (r2.left < r1.right )  {
      evt.target.classList.add('confine')
    }
    console.log("Blue Box class list: " + evt.target.classList)

  }
}