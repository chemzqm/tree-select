# tree-select

  A simple tree select component

## Installation

  Install with [component(1)](http://component.io):

    $ component install chemzqm/tree-select

## Events

* `change` value change, with value as first argumant.

## API

### TreeSelect(el, options)

* `el` hidden input element.

* `options` support `placeholder` and `data` array.

* `data` should contain objects with `id` and `text` attributes or `name `and `values` attributes for unselectable group element.

### TreeSelect#value([value])

Get or set the value.

### TreeSelect#show()

With parent element which has class `group` shown.

### TreeSelect#hide()

With parent element which has class `group` hidden.

### TreeSelect#rebuild(data)

Reset all the options with `data`.

### TreeSelect#remove()

Destroy the TreeSelect instance.

### TreeSelect#reset()

## License

  MIT
