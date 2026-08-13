Funcionalidade: Consulta de evolução do aluno
Como pessoa aluna autenticada
Quero consultar minha evolução
Para acompanhar o que planejei versus o que realizei no treino vigente

Contexto:
Dado que a API está disponível em "http://localhost:3000"

Cenário: Consulta de evolução com sucesso
Dado que estou autenticado com um token válido
E possuo um treino vigente
E possuo ao menos um exercício registrado como realizado
Quando envio uma requisição GET para "/workout/evolution"
Então devo receber o status code "200"
E a resposta deve conter o objeto "summary" com "plannedExercises", "exercisesPerformed" e "completionRate"
E a resposta deve conter "exerciseDetails" com os dados comparativos de cada exercício prescrito e realizado

Cenário: Consulta de evolução sem treino vigente
Dado que estou autenticado com um token válido
E não possuo nenhum treino vigente cadastrado
Quando envio uma requisição GET para "/workout/evolution"
Então devo receber o status code "404"
E a mensagem de erro deve ser exibida no campo "message"

Cenário: Consulta de evolução sem autenticação
Dado que não estou autenticado
Quando envio uma requisição GET para "/workout/evolution"
Então devo receber o status code "401"
E a mensagem de erro deve ser exibida no campo "message"
