import pandas as pd
import os
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
import re  # Importa o módulo de expressões regulares

# Definir as variáveis
network_path = r'\\192.168.0.239\ExportFiles\Nectar'
drive_letter = 'O:'

# Comando para mapear a unidade de rede sem usuário e senha
command = f'net use {drive_letter} {network_path} /persistent:yes'

# Executar o comando
os.system(command)

print(f'Unidade de rede {drive_letter} mapeada para {network_path}')

# Configurações do email
smtp_server = "smtp.gmail.com"
port = 587
user_name = "aylaatilio@gmail.com"
password = "tcyw lyth ymns dtux"

def enviar_email_erro(mensagem_erro):
    """Envia um e-mail de erro."""
    subject = "ERRO EM AUDIO METADADOS"
    body = f"Erro ocorrido: {mensagem_erro}"
    
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = user_name
    msg['To'] = "aylaatilio@gmail.com"
    
    try:
        with smtplib.SMTP(smtp_server, port) as server:
            server.starttls()  # Inicia a conexão TLS
            server.login(user_name, password)  # Faz login
            server.send_message(msg)  # Envia o email
            print("E-mail de erro enviado com sucesso.")
    except Exception as e:
        print(f"Erro ao enviar e-mail: {e}")

def extrair_digitos(celula):
    """Extrai dígitos antes do caractere '_' de uma célula"""
    if not isinstance(celula, str):
        celula = str(celula)
    # Usando expressão regular para encontrar números antes de '_'
    match = re.search(r'(\d+)_', celula)
    if match:
        return match.group(1)  # Retorna os dígitos encontrados
    else:
        # Se não encontrar, enviar e-mail e retornar "ERRO"
        mensagem_erro = f"Nenhum número encontrado antes de '_' na célula: {celula}"
        enviar_email_erro(mensagem_erro)
        return "ERRO"

def processar_arquivo_csv(entrada, coluna):
    """Processa o arquivo CSV e extrai dígitos de uma coluna específica"""
    codificacoes = ['utf-8', 'latin1', 'ISO-8859-1', 'cp1252']
    delimitadores = [',', ';', '\t']
    df = None

    for codificacao in codificacoes:
        for delimitador in delimitadores:
            try:
                print(f"Tentando codificação: {codificacao} e delimitador: {delimitador}")
                df = pd.read_csv(entrada, encoding=codificacao, sep=delimitador, on_bad_lines='skip')
                df.columns = df.columns.str.strip()  # Remove espaços extras dos nomes das colunas
                print(f"Colunas disponíveis: {df.columns.tolist()}")
                if coluna in df.columns:
                    break
            except UnicodeDecodeError:
                print(f"Falha ao ler com codificação: {codificacao}")
            except pd.errors.ParserError as e:
                print(f"Erro de análise com delimitador '{delimitador}': {e}")
            except Exception as e:
                print(f"Erro inesperado: {e}")
        if df is not None and coluna in df.columns:
            break

    if df is None:
        print("Não foi possível ler o arquivo com nenhuma das combinações de codificação e delimitador especificadas.")
        return None

    if coluna not in df.columns:
        print(f"A coluna '{coluna}' não existe no arquivo.")
        return None

    # Cria uma nova coluna com os dígitos extraídos
    df['CallIdMaster'] = df[coluna].apply(extrair_digitos)

    return df[['CallIdMaster']]

def excluir_arquivos_diretorio(diretorio):
    """Exclui todos os arquivos dentro do diretório especificado"""
    try:
        for arquivo in os.listdir(diretorio):
            caminho_arquivo = os.path.join(diretorio, arquivo)
            if os.path.isfile(caminho_arquivo):
                os.remove(caminho_arquivo)
                print(f"Arquivo excluído: {caminho_arquivo}")
    except Exception as e:
        print(f"Erro ao excluir arquivos do diretório '{diretorio}': {e}")

def processar_varios_arquivos(arquivos, coluna, saida_dir):
    """Processa vários arquivos CSV e salva a saída em um único arquivo"""
    dfs = []
    
    for arquivo in arquivos:
        print(f"\nProcessando arquivo: {arquivo}")
        df_processado = processar_arquivo_csv(arquivo, coluna)
        if df_processado is not None:
            dfs.append(df_processado)
    
    if not dfs:
        print("Nenhum arquivo foi processado com sucesso.")
        return

    # Concatena todos os DataFrames
    df_concatenado = pd.concat(dfs, ignore_index=True)

    # Adiciona a coluna 'Data' com a data atual
    data_atual = datetime.now().strftime('%d/%m/%Y')
    df_concatenado['Data'] = data_atual

    # Verifica se o diretório de saída é acessível
    if not os.path.exists(saida_dir):
        try:
            os.makedirs(saida_dir)
            print(f"O diretório '{saida_dir}' foi criado.")
        except Exception as e:
            print(f"Erro ao criar o diretório '{saida_dir}': {e}")
            return

    # Gera o nome do arquivo com a data atual
    nome_arquivo = f'Nectar_{datetime.now().strftime("%d_%m_%Y")}.csv'
    caminho_saida = os.path.join(saida_dir, nome_arquivo)

    # Salva o DataFrame concatenado em um único arquivo CSV com as colunas 'CallIdMaster' e 'Data'
    df_concatenado.to_csv(caminho_saida, index=False, sep=';', header=['CallIdMaster', 'Data'])
    print(f'Arquivo concatenado salvo com sucesso em: {caminho_saida}')

    # Exclui todos os arquivos no diretório raiz
    #excluir_arquivos_diretorio(os.path.dirname(arquivos[0]))

# Lista de arquivos a serem processados
arquivos = [
    r'C:\Users\marcos.silva\Desktop\metadados\meta\metadados_18.csv',
    r'C:\Users\marcos.silva\Desktop\metadados\meta\metadados_55.csv'
]
coluna = 'nome_audio'  # Nome correto da coluna conforme o cabeçalho do CSV
#saida_dir = r'\\192.168.0.239\ExportFiles\Nectar' 
saida_dir = r'C:\Users\marcos.silva\Desktop\metadados'

processar_varios_arquivos(arquivos, coluna, saida_dir)
