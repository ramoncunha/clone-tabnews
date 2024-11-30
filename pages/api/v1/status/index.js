function status(request, response) {
  response.status(200).json({ chave: "sou uma pessoa acima da média" });
}

export default status;
