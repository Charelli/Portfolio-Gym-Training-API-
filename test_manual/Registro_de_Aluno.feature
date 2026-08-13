            Funcionalidade: Registro e login de aluno na Gym Training API
            Como pessoa aluna
            Quero me cadastrar e acessar minha conta
            Para utilizar os serviços de treino da API

            Contexto:
            Dado que a API está disponível em "http://localhost:3000"

            # ============================================
            # POST /auth/register
            # ============================================

            Cenário: Registro de aluno realizado com sucesso
            Quando envio uma requisição POST para "/auth/register" com os campos:
            | email           | aluno@teste.com |
            | password        | senha123        |
            | age             | 28              |
            | weight          | 75              |
            | height          | 178             |
            | objective       | hipertrofia     |
            | experienceLevel | iniciante       |
            Então devo receber o status code "201"
            E a resposta deve conter os dados do "UserProfile" cadastrado
            E o campo "hasWorkout" deve ser "false"

            Esquema do Cenário: Validar campos obrigatórios ausentes no registro
            Quando envio uma requisição POST para "/auth/register" sem o campo "<campo>"
            E informo os demais campos obrigatórios corretamente
            Então devo receber o status code "400"
            E a mensagem de erro deve ser exibida no campo "message"

            Exemplos:
            | campo           |
            | email           |
            | password        |
            | age             |
            | weight          |
            | height          |
            | objective       |
            | experienceLevel |

            Cenário: Registro de aluno com e-mail em formato inválido
            Quando envio uma requisição POST para "/auth/register" informando "email" como "email-invalido-sem-arroba"
            E informo os demais campos obrigatórios corretamente
            Então devo receber o status code "400"
            E a mensagem de erro deve ser exibida no campo "message"

            Cenário: Registro de aluno com email já cadastrado
            Dado que já existe um aluno cadastrado com o email "aluno@teste.com"
            Quando envio uma requisição POST para "/auth/register" informando "email" como "aluno@teste.com"
            E informo os demais campos obrigatórios corretamente
            Então devo receber o status code "409"
            E a mensagem de erro deve ser exibida no campo "message"

            # ============================================
            # POST /auth/login
            # ============================================

            Cenário: Login realizado com sucesso
            Dado que possuo um cadastro ativo com email "aluno@teste.com" e senha "senha123"
            Quando envio uma requisição POST para "/auth/login" informando "email" como "aluno@teste.com" e "password" como "senha123"
            Então devo receber o status code "200"
            E a resposta deve conter o campo "token"
            E a resposta deve conter o objeto "user" com os dados do "UserProfile"

            Cenário: Login com senha incorreta
            Dado que possuo um cadastro ativo com email "aluno@teste.com" e senha "senha123"
            Quando envio uma requisição POST para "/auth/login" informando "email" como "aluno@teste.com" e "password" como "senhaErrada"
            Então devo receber o status code "401"
            E a mensagem de erro deve ser exibida no campo "message"

            Cenário: Login com email não cadastrado
            Dado que não existe cadastro com o email "naoexiste@teste.com"
            Quando envio uma requisição POST para "/auth/login" informando "email" como "naoexiste@teste.com" e "password" como "qualquerSenha"
            Então devo receber o status code "401"
            E a mensagem de erro deve ser exibida no campo "message"

            Esquema do Cenário: Validar campos obrigatórios ausentes no login
            Quando envio uma requisição POST para "/auth/login" sem o campo "<campo>"
            E informo os demais campos obrigatórios corretamente
            Então devo receber o status code "400"
            E a mensagem de erro deve ser exibida no campo "message"

            Exemplos:
            | campo    |
            | email    |
            | password |
