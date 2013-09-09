
build: components index.js tree-select.css template.js
	@component build --dev
	@touch build

start:
	@component serve &

template.js: template.html
	@component convert $<

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

.PHONY: clean start
