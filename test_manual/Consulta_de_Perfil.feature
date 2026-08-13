            Funcionalidade: Consulta e atualização de perfil do aluno
            Como pessoa aluna autenticada
            Quero consultar e atualizar meus dados
            Para manter minhas especificações de treino corretas

            Contexto:
            Dado que a API está disponível em "http://localhost:3000"

            # ============================================
            # GET /profile
            # ============================================

            Cenário: Consulta do perfil com sucesso
            Dado que estou autenticado com um token válido
            Quando envio uma requisição GET para "/profile"
            Então devo receber o status code "200"
            E a resposta deve conter os dados do "UserProfile" do aluno logado

            Cenário: Consulta do perfil sem autenticação
            Dado que não estou autenticado
            Quando envio uma requisição GET para "/profile"
            Então devo receber o status code "401"
            E a mensagem de erro deve ser exibida no campo "message"

            Cenário: Consulta do perfil com token inválido ou expirado
            Dado que estou autenticado com um token inválido ou expirado
            Quando envio uma requisição GET para "/profile"
            Então devo receber o status code "401"
            E a mensagem de erro deve ser exibida no campo "message"

            # ============================================
            # PATCH /profile
            # ============================================

            Cenário: Atualização do perfil realizada com sucesso
            Dado que estou autenticado com um token válido
            Quando envio uma requisição PATCH para "/profile" informando "weight" como "80" e "objective" como "emagrecimento"
            Então devo receber o status code "200"
            E a resposta deve conter o "UserProfile" atualizado
            E o campo "weight" deve ser "80"
            E o campo "objective" deve ser "emagrecimento"
            E o campo "updatedAt" deve ser atualizado com a data/hora atual

            Esquema do Cenário: Validar valores inválidos na atualização do perfil
            Dado que estou autenticado com um token válido
            Quando envio uma requisição PATCH para "/profile" informando "<campo>" como "<valor_invalido>"
            Então devo receber o status code "400"
            E a mensagem de erro deve ser exibida no campo "message"

            Exemplos:
            | campo  | valor_invalido |
            | age    | trinta         |
            | weight | pesado         |
            | height | alto           |

Cenário: Atualização do perfil sem autenticação
Dado que não estou autenticado
Quando envio uma requisição PATCH para "/profile" informando "weight" como "80"
Então devo receber o status code "401"
E a mensagem de erro deve ser exibida no campo "message"

Cenário: Atualização do perfil com corpo de requisição vazio
Dado que estou autenticado com um token válido
Quando envio uma requisição PATCH para "/profile" sem informar nenhum campo no corpo
Então devo receber o status code "200"
E a resposta deve conter o "UserProfile" sem alterações
