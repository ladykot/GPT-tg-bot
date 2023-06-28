build:
	docker build -t botl .

run:
	docker run -d -p 3000:3000 --name tgbot --rm botl