var Emitter = require('emitter');
var template = require('./template');
var $ = require('jquery');
var keyname = require('keyname');
var equals = require('equals');

function TreeSelect (input, data) {
  this.source = $(input);
  this.el = $(template).insertBefore(input);
  this.container= this.el.find('.treeselect-container');
  this.dropdown = this.el.find('.treeselect-drop');
  this.input = this.el.find('.treeselect-input');
  var w = this.source.width();
  this.el.width(w);
  if (data) { this.renderData(data); }
  this.initEvents();
}

Emitter(TreeSelect.prototype);

TreeSelect.prototype.placeholder = function(placeholder) {
  this._placeholder = placeholder;
  if (this.el.find('.treeselect-choice').hasClass('treeselect-default')) {
    this.el.find('.treeselect-chosen').html(placeholder);
  }
}

TreeSelect.prototype.selectDefault = function() {
  this._default = true;
  var li = this.dropdown.find('.treeselect-item:first');
  var v = this.value();
  if (li.length > 0 && !v) {
    var id = li.attr('data-id');
    this.value(id);
  }
}

TreeSelect.prototype.renderData = function(data) {
  this.data = data;
  data.forEach(function(o) {
    var parent = this.dropdown.find('.treeselect-results');
    if (Array.isArray(o.values)) {
      this.addGroup(parent, o);
    } else {
      this.addItem(parent, o.id, o.text);
    }
  }.bind(this));
  this.rendered = true;
  var v = this.source.val(), li, id;
  if (v) {
    li = this.dropdown.find('[data-id="' + v + '"]');
    //no change event
    if (li.length === 0) return this.source.val('');
    id = li.attr('data-id');
    this.value(id);
  }
  else if (this._default) {
    li = this.dropdown.find('.treeselect-item:first');
    id = li.attr('data-id');
    this.value(id);
  }
}

TreeSelect.prototype.initEvents = function() {
  this._containerClick = this.containerClick.bind(this);
  this.container.on('click', this._containerClick);
  this._dropdownClick = this.dropdownClick.bind(this);
  this.dropdown.on('click', this._dropdownClick);
  this._filter = this.filter.bind(this);
  this.input.on('keyup', this._filter);
  $(document).on('click', this.documentClick.bind(this));
}

TreeSelect.prototype.filter = function(e) {
  var str = this.input.val().toLowerCase();
  var items = this.dropdown.find('.treeselect-item');
  var key = keyname(e.which);
  this.dropdown.find('.treeselect-list').show();
  this.dropdown.find('.treeselect-group').addClass('treeselect-collpase');
  var v = this.value();
  switch(key) {
    case 'up':
      this.prev();
      break;
    case 'down':
      this.next();
      break;
    case 'enter':
      var el = this.dropdown.find('.treeselect-item.active');
      if (el.length) {
        this.select(el);
      }
      break;
    default:
      if (!str) {
        items.show();
      } else {
        items.each(function(i) {
          var text = this.innerHTML.toLowerCase();
          var id = $(this).attr('data-id');
          if (id != v && text.indexOf(str) !== -1) {
            $(this).show();
          } else {
            $(this).hide();
          }
        })
      }
  }
}

TreeSelect.prototype.prev = function() {
  var items = this.dropdown.find('.treeselect-item');
  var lis = items.filter(':visible');
  var curr, index = lis.length - 1;
  lis.each(function(i) {
    if ($(this).hasClass('active')) {
      curr = $(this);
      index = i - 1;
    }
  })
  items.removeClass('active');
  index = index === -1? lis.length - 1 : index;
  lis.eq(index).addClass('active');
}

TreeSelect.prototype.next = function() {
  var items = this.dropdown.find('.treeselect-item');
  var lis = items.filter(':visible');
  var curr, index = 0;
  lis.each(function(i) {
    if ($(this).hasClass('active')) {
      curr = $(this);
      index = i + 1;
    }
  })
  items.removeClass('active');
  index = index === lis.length? 0 : index;
  lis.eq(index).addClass('active');
}

TreeSelect.prototype.remove = function() {
  this.off();
  this.container.off();
  this.dropdown.off();
}

TreeSelect.prototype.containerClick = function(e) {
  var target = $(e.target);
  if (this.container.hasClass('treeselect-dropdown-open')) {
    this.container.removeClass('treeselect-dropdown-open');
    this.dropdown.hide();
    this.container.removeClass('treeselect-focus');
  } else {
    this.container.addClass('treeselect-dropdown-open');
    this.dropdown.show();
    this.container.addClass('treeselect-focus');
    this.input.focus();
  }
}

TreeSelect.prototype.dropdownClick = function(e) {
  var el = $(e.target);
  e.stopPropagation();
  if (el.hasClass('treeselect-group') || el.hasClass('treeselect-arrow')) {
    var group = el.parent('.treeselect-group').addBack('.treeselect-group');
    if (group.hasClass('treeselect-collpase')) {
      group.next('.treeselect-list').hide();
      group.removeClass('treeselect-collpase');
    } else {
      group.next('.treeselect-list').show();
      group.addClass('treeselect-collpase');
    }
  } else if (el.hasClass('treeselect-item')) {
    this.select(el);
  }
}

TreeSelect.prototype.select = function(el) {
  var id = el.attr('data-id');
  this.value(id);
  this.container.removeClass('treeselect-dropdown-open');
  this.container.removeClass('treeselect-focus');
  this.dropdown.find('.treeselect-list').hide();
  this.dropdown.find('.treeselect-group').removeClass('treeselect-collpase');
  this.input.val('');
  this.dropdown.hide();
}

TreeSelect.prototype.documentClick = function(e) {
  var el = $(e.target).parents('.treeselect');
  if (!el.is(this.el)) {
    this.container.removeClass('treeselect-focus');
    this.container.removeClass('treeselect-dropdown-open');
    this.dropdown.hide();
  }
}

TreeSelect.prototype.addGroup = function(parent, data) {
  var title = $('<div class="treeselect-group"><i class="treeselect-arrow"></i>' + data.name + '</div>');
  var ul = $('<ul class="treeselect-list"></ul>');
  title.appendTo(parent);
  ul.appendTo(parent);
  data.values.forEach(function(o) {
    this.addItem(ul, o.id, o.text);
  }.bind(this));
}

TreeSelect.prototype.addItem = function(ul, id, text) {
  var li = $('<li class="treeselect-item" data-id="' + id + '">' + text + '</li>')
  li.appendTo(ul);
}

TreeSelect.prototype.removeItem = function(id) {
  if (!id) return;
  var li = this.el.find('.treeselect-search-choice').filter('[data-id="' + id + '"]');
  li.remove();
}

TreeSelect.prototype.value = function(v) {
  if (arguments.length === 0) return this.source.val();
  var pre = this.source.val();
  this.dropdown.find('.treeselect-item').show();
  this.source.val(v);
  var text;
  if (!v) {
    text = this._placeholder;
    if (text) {
      this.container.find('.treeselect-chosen').html(text);
      this.container.find('.treeselect-choice').addClass('treeselect-default');
    }
  } else {
    var li = this.dropdown.find('[data-id="' + v + '"]');
    li.hide();
    text = li.html();
    this.container.find('.treeselect-chosen').html(text);
    this.container.find('.treeselect-choice').removeClass('treeselect-default');
  }
  if (pre != v) {
    this.emit('change', v);
  }
}

TreeSelect.prototype.reset = function() {
  this.value('');
}

TreeSelect.prototype.rebuild = function(data) {
  if (equals(this.data, data)) return;
  if (!this.data) return this.renderData(data);
  this.reset();
  this.dropdown.find('.treeselect-item').remove();
  this.dropdown.find('.treeselect-group').remove();
  this.renderData(data);
}

TreeSelect.prototype.ids = function() {
  return $.map(this.dropdown.find('.treeselect-item'), function (li) {
    return $(li).attr('data-id');
  })
}

module.exports = TreeSelect;
