var Emitter = require('emitter');
var template = require('./template');
var $ = require('jquery');
var keyname = require('keyname');

function TreeSelect (input, data) {
  this.source = $(input);
  this.el = $(template).insertBefore(input);
  this.container= this.el.find('.treeselect-container');
  this.dropdown = this.el.find('.treeselect-drop');
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
    var parent = this.dropdown;
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
  $(document).on('click', this.documentClick.bind(this));
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
    var id = el.attr('data-id');
    this.value(id);
    this.container.removeClass('treeselect-dropdown-open');
    this.container.removeClass('treeselect-focus');
    this.dropdown.hide();
  }
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
  if (data === this.data) return;
  if (!this.data) return this.renderData(data);
  this.reset();
  this.dropdown.find('.treeselect-item').remove();
  this.renderData(data);
}

TreeSelect.prototype.ids = function() {
  return $.map(this.dropdown.find('.treeselect-item'), function (li) {
    return $(li).attr('data-id');
  })
}

module.exports = TreeSelect;
