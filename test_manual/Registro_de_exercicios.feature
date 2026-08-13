            Funcionalidade: Registro de exercícios realizados
            Como pessoa aluna autenticada
            Quero registrar os exercícios que realizei
            Para que minha evolução seja acompanhada corretamente

            Contexto:
            Dado que a API está disponível em "http://localhost:3000"
            E estou autenticado com um token válido
            E possuo um treino vigente

            Cenário: Registro de exercício realizado com sucesso
            Quando envio uma requisição POST para "/workout/completed" com os campos:
            | exerciseName | Supino reto         |
            | date         | 2026-08-12T10:00:00 |
            | sets         | 4                   |
            | reps         | 10                  |
            | weight       | 40                  |
            Então devo receber o status code "201"
            E a resposta deve conter os dados do exercício registrado

            Esquema do Cenário: Validar campos obrigatórios ausentes no registro de exercício
            Quando envio uma requisição POST para "/workout/completed" sem o campo "<campo>"
            E informo os demais campos obrigatórios corretamente
            Então devo receber o status code "400"
            E a mensagem de erro deve ser exibida no campo "message"

            Exemplos:
            | campo        |
            | exerciseName |
            | date         |
            | sets         |
            | reps         |

Cenário: Registro de exercício com "sets" em formato inválido
Quando envio uma requisição POST para "/workout/completed" informando "sets" como "quatro"
E informo os demais campos obrigatórios corretamente
Então devo receber o status code "400"
E a mensagem de erro deve ser exibida no campo "message"

Cenário: Registro de exercício sem autenticação
Dado que não estou autenticado
Quando envio uma requisição POST para "/workout/completed" com dados válidos
Então devo receber o status code "401"
E a mensagem de erro deve ser exibida no campo "message"
