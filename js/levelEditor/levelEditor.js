// main code for the levelEditor
/* global interact, HierarchyUtil, PositionUtil, DragUtil, DOMUtil */

interact('.draggable')
  .draggable({
    // enable autoScroll
    autoScroll: true,

    ignoreFrom: '.dropzone, .static',
    snap: {
      targets: [],
      relativePoints: [{ x: 0, y: 0 }],
      range: 500000,
      endOnly: true,
    },

    onstart: (event) => {
      const { target } = event;
      if (target.classList.contains('untouched')) {
        // initialize
        // create a new object
        const clone = target.cloneNode(true);
        document.body.appendChild(clone);
        // set position so we can move
        const { left, top } = getComputedStyle(target, null);
        const absLeft = `${Number(left.slice(0, left.length - 2)) + window.pageXOffset}px`;
        const absTop = `${Number(top.slice(0, top.length - 2)) + window.pageYOffset}px`;
        target.style.position = 'absolute';
        target.style.right = 'auto';
        target.style.left = absLeft;
        target.style.top = absTop;
        // add it to the hierarchy
        HierarchyUtil.setChildren(target, []);
        // add child drop-zones
        DOMUtil.expandBox(target);
        // don't do this again
        target.classList.remove('untouched');
      }
      // activate the zones
      DragUtil.activateDropzones(target);
      // now remove the parent of dragged node: the zone it came from is not active
      const parent = HierarchyUtil.removeParent(target);
      // remove the boxes above and below where we came from
      DOMUtil.fuseBox(parent);
      DOMUtil.childResize(parent);
      // reset positioning
      PositionUtil.moveChildren(parent);
      DragUtil.dropChildren(parent);
      // finally move us to top
      PositionUtil.setHighestZ(target);
      // set opacity (css)
      target.classList.add('dragging');
    },
    // call this function on every dragmove event
    onmove: PositionUtil.dragMoveListener,
    // call this function on every dragend event
    onend: (event) => {
      let trashed = false;
      if (event.relatedTarget !== null) {
        if (event.relatedTarget.classList.contains('trashcan')) {
          trashed = true;
          DOMUtil.trash(event.target);
        } else if (event.relatedTarget.classList.contains('drop-active')) {
          // dropped somewhere
          HierarchyUtil.addToHierarchy(event.relatedTarget, event.target);
          DOMUtil.childResize(event.relatedTarget);
          DOMUtil.splitBox(event.relatedTarget);
        }
      }
      if (!trashed) {
        DragUtil.dropChildren(event.target);
        event.target.classList.remove('dragging');
      }
      DragUtil.deactivateDropzones();
    },
  });


interact('.drop-active')
  .dropzone({
    ondropactivate: (event) => {
      // add active dropzone feedback
    },

    ondropdeactivate: (event) => {
      // reset snapping
      if (event.draggable.draggable().snap.targets.length !== 0
        && event.target !== undefined
      ) {
        event.draggable.draggable({
          snap: {
            targets: [],
            range: 500,
          },
        });
      }
    },

    ondragenter: (event) => {
      const dropRect = interact.getElementRect(event.target);
      // snap to this box
      event.draggable.draggable({
        snap: {
          targets: [{
            x: dropRect.left,
            y: dropRect.top,
          }],
        },
      });
    },

    ondragleave: (event) => {
      const dropRect = interact.getElementRect(event.target);
      const dropTarget = { x: dropRect.left, y: dropRect.top };
      const { x, y } = event.draggable.draggable().snap.targets[0];
      if (x === dropTarget.x && y === dropTarget.y) {
        event.draggable.draggable({
          snap: {
            targets: [],
            range: 500,
          },
        });
      }
    },
  });

interact('.trashcan')
  .dropzone({
    overlap: 0.001,

    ondragenter: (event) => {
      event.draggable.draggable({
        trash: true,
      });
    },

    ondragleave: (event) => {
      event.draggable.draggable({
        trash: undefined,
      });
    },
  });
