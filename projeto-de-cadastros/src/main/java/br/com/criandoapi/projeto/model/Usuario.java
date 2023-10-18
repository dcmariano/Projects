package br.com.criandoapi.projeto.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios")
public class Usuario {
	
	@Id
	@GeneratedValue (strategy = GenerationType.IDENTITY)
	@Column(name= "id")
    private int id;
	
	@Column(name = "nome",length = 255,nullable = true)
    private String nome;
	
	@Column(name = "email",length = 255,nullable = true)
    private String email;
	
	@Column(name = "tipo",length = 20,nullable = true)
    private String tipo;
	
	@Column(name = "cpf",length = 14,nullable = true)
    private String cpf;
	
	@Column(name = "cnpj",length = 18,nullable = true)
    private String cnpj;
	
	@Column(name = "cep",length = 10,nullable = true)
    private String cep;
	
	@Column(name = "endereco",length = 255,nullable = true)
    private String endereco;
	
	@Column(name = "complemento",length = 255,nullable = true)
    private String complemento;
	
	@Column(name = "bairro",length = 255,nullable = true)
    private String bairro;
	
	@Column(name = "cidade",length = 255,nullable = true)
    private String cidade;
	
	@Column(name = "estado",length = 2,nullable = true)
    private String estado;

    // Getters e Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getComplemento() {
        return complemento;
    }

    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}

