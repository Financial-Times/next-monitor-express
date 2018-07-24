install:
	@yarn

run:
	@rm -rf .build
	@node_modules/.bin/webpack