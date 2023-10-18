package br.com.criandoapi.projeto.DAO;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import br.com.criandoapi.projeto.model.Usuario;

@Repository
public interface IUsuario extends CrudRepository<Usuario, Integer> {
    List<Usuario> findByNome(String nome);
    List<Usuario> findByCpf(String cpf);
    List<Usuario> findByNomeAndCpf(String nome, String cpf);
}
