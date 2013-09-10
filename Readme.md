# tree-select

  A simple tree select component

  [Demo](http://chemzqm.github.io/tree-select/index.html)

## Installation

  Install with [component(1)](http://component.io):

    $ component install chemzqm/tree-select

## Events

* `change` value change, with value as first argumant.

## API

### TreeSelect(el, data)

* `el` hidden input element.

* `data` should contain objects with `id` and `text` attributes or `name `and `values` attributes for unselectable group element.

### TreeSelect#placeholder(text)

Set placeholder with `text`.

### TreeSelect#selectDefault()

Select the first value as default.

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
