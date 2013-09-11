# tree-select

  A simple tree select component

  [Demo](http://chemzqm.github.io/tree-select/index.html)

## Installation

  Install with [component(1)](http://component.io):

    $ component install chemzqm/tree-select

## Events

* `change` value change, with value as first argumant.

## API

### new TreeSelect(el, data)

* `el` hidden input element.

* `data` should contain objects with `id` and `text` attributes or `name `and `values` attributes for unselectable group element.

### .placeholder(text)

Set placeholder with `text`.

### .selectDefault()

Select the first value as default.

### .value([value])

Get or set the value.

### .show()

With parent element which has class `group` shown.

### .hide()

With parent element which has class `group` hidden.

### .rebuild(data)

Reset all the options with `data`.

### .remove()

Destroy the TreeSelect instance.

### .reset()

## License

  MIT
