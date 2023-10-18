package br.com.criandoapi.projeto.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.criandoapi.projeto.DAO.IUsuario;
import br.com.criandoapi.projeto.model.Usuario;

@RestController

@RequestMapping("/usuarios")
public class UsuarioController {

	@Autowired
	private IUsuario dao;

	@GetMapping
	public List<Usuario> listaUsuarios() {
		return (List<Usuario>) dao.findAll();
	}

	@PostMapping
	public Usuario criarUsuario(@RequestBody Usuario usuario) {
		Usuario usuarioNovo = dao.save(usuario);
		return usuarioNovo;
	}

	@PutMapping("/{id}")
	public ResponseEntity<Usuario> editarUsuario(@PathVariable Integer id, @RequestBody Usuario usuario) {
	    Optional<Usuario> usuarioExistente = dao.findById(id);

	    if (usuarioExistente.isPresent()) {
	        Usuario usuarioAtualizado = usuarioExistente.get();
	        usuarioAtualizado.setNome(usuario.getNome());
	        usuarioAtualizado.setEmail(usuario.getEmail());
	        usuarioAtualizado.setCpf(usuario.getCpf());

	        Usuario usuarioNovo = dao.save(usuarioAtualizado);
	        return ResponseEntity.ok(usuarioNovo);
	    } else {
	        return ResponseEntity.notFound().build();
	    }
	}


	@DeleteMapping("/{id}")
	public Optional<Usuario> excluirUsuario(@PathVariable Integer id) {
		Optional<Usuario> usuario = dao.findById(id);
		dao.deleteById(id);
		return usuario;
	}

	@GetMapping("/buscar")
	public ResponseEntity<List<Usuario>> buscarUsuariosPorNomeECPF(@RequestParam(required = false) String nome,
			@RequestParam(required = false) String cpf) {
		List<Usuario> usuarios;

		if (nome != null && !nome.isEmpty() && cpf != null && !cpf.isEmpty()) {
			usuarios = dao.findByNomeAndCpf(nome, cpf);
		} else if (nome != null && !nome.isEmpty()) {
			usuarios = dao.findByNome(nome);
		} else if (cpf != null && !cpf.isEmpty()) {
			usuarios = dao.findByCpf(cpf);
		} else {
			usuarios = (List<Usuario>) dao.findAll();
		}

		return ResponseEntity.ok(usuarios);
	}
	
	@PatchMapping("/{id}")
	public ResponseEntity<Usuario> atualizarUsuario(@PathVariable Integer id, @RequestBody Usuario usuario) {
	    Optional<Usuario> usuarioExistente = dao.findById(id);

	    if (usuarioExistente.isPresent()) {
	        Usuario usuarioAtualizado = usuarioExistente.get();
	        
	        if (usuario.getNome() != null) {
	            usuarioAtualizado.setNome(usuario.getNome());
	        }
	        if (usuario.getEmail() != null) {
	            usuarioAtualizado.setEmail(usuario.getEmail());
	        }
	        if (usuario.getCpf() != null) {
	            usuarioAtualizado.setCpf(usuario.getCpf());
	        }

	        Usuario usuarioNovo = dao.save(usuarioAtualizado);
	        return ResponseEntity.ok(usuarioNovo);
	    } else {
	        return ResponseEntity.notFound().build();
	    }
	}


}
