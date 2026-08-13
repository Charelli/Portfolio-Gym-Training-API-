Funcionalidade: Consulta e geração do treino atual via Gemini
Como pessoa aluna autenticada
Quero consultar meu treino atual
Para saber quais exercícios devo realizar, com renovação automática a cada 45 dias

Contexto:
Dado que a API está disponível em "http://localhost:3000"

Cenário: Consulta do treino atual já existente e vigente
Dado que estou autenticado com um token válido
E possuo um treino gerado há menos de 45 dias
Quando envio uma requisição GET para "/workout/current"
Então devo receber o status code "200"
E a resposta deve conter o objeto "currentWorkout" com o plano de exercícios vigente
E o campo "generatedAt" deve corresponder à data da última geração

Cenário: Primeira geração de treino via Gemini para aluno sem ficha
Dado que estou autenticado com um token válido
E ainda não possuo nenhum treino gerado
Quando envio uma requisição GET para "/workout/current"
Então devo receber o status code "200"
E a API deve chamar o serviço Gemini para gerar um novo treino
E a resposta deve conter "plan.objective" igual ao meu objetivo cadastrado no perfil
E a resposta deve conter "plan.exercises" com ao menos um exercício
E o campo "generatedAt" deve ser preenchido com a data/hora atual

Cenário: Renovação automática do treino após 45 dias
Dado que estou autenticado com um token válido
E meu treino vigente foi gerado há mais de 45 dias
E possuo histórico de exercícios realizados registrado
Quando envio uma requisição GET para "/workout/current"
Então devo receber o status code "200"
E a API deve chamar novamente o serviço Gemini considerando meu histórico
E o campo "generatedAt" deve ser atualizado para a data/hora atual
E o plano de exercícios anterior deve ser substituído pelo novo

Cenário: Consulta do treino atual sem autenticação
Dado que não estou autenticado
Quando envio uma requisição GET para "/workout/current"
Então devo receber o status code "401"
E a mensagem de erro deve ser exibida no campo "message"

Cenário: Consulta do treino atual com token inválido ou expirado
Dado que estou autenticado com um token inválido ou expirado
Quando envio uma requisição GET para "/workout/current"
Então devo receber o status code "401"
E a mensagem de erro deve ser exibida no campo "message"

Cenário: Falha na geração do treino por indisponibilidade do Gemini
Dado que estou autenticado com um token válido
E o serviço Gemini está indisponível ou retorna erro
Quando envio uma requisição GET para "/workout/current"
Então devo receber o status code "502"
E a mensagem de erro deve ser exibida no campo "message"
E nenhum treino corrompido ou incompleto deve ser salvo
