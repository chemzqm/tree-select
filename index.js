var Emitter = require('emitter');
var template = require('./template');
var $ = require('jquery');
var keyname = require('keyname');

function TreeSelect (input, config) {
  this.source = $(input);
  this.el = $(template).insertBefore(input);
  this.container= this.el.find('.treeselect-container');
  this.dropdown = this.el.find('.treeselect-drop');
  var w = this.source.width();
  this.el.width(w);
  this.opts = config;
  var data = this.opts.data;
  this.renderData(data)
  this.el.find('.treeselect-chosen').html(config.placeholder);
  this.initEvents();
}

Emitter(TreeSelect.prototype);

TreeSelect.prototype.renderData = function(data) {
  data.forEach(function(o) {
    var parent = this.dropdown;
    if (Array.isArray(o.values)) {
      this.addGroup(parent, o);
    } else {
      this.addItem(parent, o.value, o.text);
    }
  }.bind(this));
}

TreeSelect.prototype.initEvents = function() {
  this._containerClick = this.containerClick.bind(this);
  this.container.on('click', this._containerClick);
  this._dropdownClick = this.dropdownClick.bind(this);
  this.dropdown.on('click', this._dropdownClick);
  //删除一个已有选项
  //$(document).on('keydown', function(e) {
  //  if (!this.container.hasClass('treeselect-focus')) return;
  //  var key = keyname(e.which);
  //  switch(key) {
  //    case 'backspace':
  //      var id = this.el.find('.treeselect-search-choice:last').attr('data-id');
  //      this.removeItem(id);
  //      break;
  //    default:
  //  }
  //}.bind(this))
}

TreeSelect.prototype.remove = function() {
  this.off();
  this.container.off();
  this.dropdown.off();
}

TreeSelect.prototype.containerClick = function(e) {
  e.stopPropagation();
  var target = $(e.target);
  //移除按钮
  //if (target.hasClass('treeselect-search-choice-close')) {
  //  return target.parent().remove();
  //}
  if (this.container.hasClass('treeselect-dropdown-open')) {
    this.container.removeClass('treeselect-dropdown-open');
    this.dropdown.hide();
    this.container.removeClass('treeselect-focus');
  } else {
    this.container.addClass('treeselect-dropdown-open');
    this.dropdown.show();
    this.container.addClass('treeselect-focus');
    $(document).one('click', this.documentClick.bind(this));
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
  if (el.length === 0) {
    this.container.removeClass('treeselect-focus');
    this.container.removeClass('treeselect-dropdown-open');
    this.dropdown.hide();
  }
}

TreeSelect.prototype.show = function() {
  var el = this.source;
  el.parent('.group').show();
  this.el.show();
  el.attr('disabled', false);
  return this;
}

TreeSelect.prototype.hide = function() {
  var el = this.source;
  el.parent('.group').hide();
  this.el.hide();
  el.attr('disabled', true);
  return this;
}

TreeSelect.prototype.addGroup = function(parent, data) {
  var title = $('<div class="treeselect-group"><i class="treeselect-arrow"></i>' + data.name + '</div>');
  var ul = $('<ul class="treeselect-list"></ul>');
  title.appendTo(parent);
  ul.appendTo(parent);
  data.values.forEach(function(o) {
    this.addItem(ul, o.value, o.text);
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
  if (arguments.length === 0) return this._v;
  var li = this.dropdown.find('[data-id="' + v + '"]');
  if (li.length > 0 && v.toString() !== this._v) {
    this._v = v.toString();
    this.dropdown.find('.treeselect-item').show();
    li.hide();
    var text = li.html();
    this.container.find('.treeselect-chosen').html(text);
    this.source.val(v);
    this.container.find('.treeselect-choice').removeClass('treeselect-default');
    this.emit('change', v);
  }
}

TreeSelect.prototype.reset = function() {
  this.source.val('');
  this._v = '';
  var text = this.opts.placeholder;
  this.container.find('.treeselect-chosen').html(text);
  this.dropdown.find('.treeselect-item').show();
  this.container.find('.treeselect-choice').addClass('treeselect-default');
  this.emit('change', '');
}

TreeSelect.prototype.rebuild = function(data) {
  this.reset();
  this.dropdown.html('');
  this.renderData(data);
}

module.exports = TreeSelect;
