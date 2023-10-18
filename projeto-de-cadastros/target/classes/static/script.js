// Esta função busca informações de endereço usando a API ViaCEP.
function buscarEndereco() {
	var cep = $('#cep').val();
	var url = 'https://viacep.com.br/ws/' + cep + '/json/';

	fetch(url)
		.then(function(response) {
			if (!response.ok) {
				mostrarAlerta('CEP não encontrado.');
				limparCamposEndereco();
				throw new Error('CEP não encontrado');
			}
			return response.json();
		})
		.then(function(data) {
			if (data.erro) {
				mostrarAlerta('CEP não encontrado.');
				limparCamposEndereco();
				return;
			}

			$('#endereco').val(data.logradouro);
			$('#complemento').val(data.complemento);
			$('#bairro').val(data.bairro);
			$('#cidade').val(data.localidade);
			$('#estado').val(data.uf);
		})
		.catch(function(error) {
			console.error('Erro ao buscar CEP:', error);
			mostrarAlerta('CEP não encontrado. Verifique o CEP e tente novamente.');
			limparCamposEndereco();
		});
}


$(document).ready(function() {


	// Função para alternar a visibilidade do campo CNPJ
	$("#row-cnpj").hide(); // Inicialmente, ocultar campo CNPJ
	$("#tipo").on("change", function() {
		var selectedOption = $(this).val();
		if (selectedOption === "fisica") {
			$("#row-cpf").show();
			$("#row-cnpj").hide();
			$("label[for='cnpj']").text("CPF");
			$("#cpf").attr("placeholder", "000.000.000-00");
		} else if (selectedOption === "juridica") {
			$("#row-cpf").hide();
			$("#row-cnpj").show();
			$("label[for='cnpj']").text("CNPJ");
			$("#cnpj").attr("placeholder", "00.000.000/0000-00");
		}
	});


	// Função para alternar a exibição de um popup pelo seu ID
	function togglePopup(popupId) {
		$("#" + popupId).toggle();
	}


	// Função para adicionar pontuação no cpf cep e cnpj
	function formatNumber(input, format) {
		var value = input.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
		var formattedValue = '';

		var index = 0;
		for (var i = 0; i < format.length; i++) {
			if (index >= value.length) {
				break;
			}
			if (format[i] === '#') {
				formattedValue += value[index];
				index++;
			} else {
				formattedValue += format[i];
			}
		}

		return formattedValue;
	}

	// Função para formatar o nome
	function formatName(input) {
		var words = input.split(' ');
		var formattedName = '';

		for (var i = 0; i < words.length; i++) {
			var word = words[i];
			if (/^[a-zA-Z]+$/.test(word)) { // Verifica se a palavra contém apenas letras
				formattedName += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
				if (i !== words.length - 1) {
					formattedName += ' ';
				}
			}
		}

		return formattedName;
	}

	// Manipulador de evento para o formulário de cadastro de usuário.
	$('#formulario').submit(function(e) {
		e.preventDefault();

		var cpfInput = $('#cpf');
		var cnpjInput = $('#cnpj');
		var cpf = cpfInput.val().replace(/[^\d]/g, '');
		var cnpj = cnpjInput.val().replace(/[^\d]/g, '');

		if ((cpf.length !== 11 && cnpj.length !== 14) || (cpf.length === 11 && cnpj.length === 14)) {
			alert('Por favor, digite um CPF completo ou um CNPJ valido.');
			return;
		}

		var formData = {
			nome: formatName($('#nome').val()),
			email: $('#email').val(),
			tipo: $('#tipo').val(),
			cpf: cpf,
			cnpj: cnpj,
			cep: $('#cep').val().replace(/[^\d]/g, ''),
			endereco: $('#endereco').val(),
			complemento: $('#complemento').val(),
			bairro: $('#bairro').val(),
			cidade: $('#cidade').val(),
			estado: $('#estado').val()
		};

		formData.cpf = formatNumber(formData.cpf, '###.###.###-##');
		formData.cnpj = formatNumber(formData.cnpj, '##.###.###/####-##');
		formData.cep = formatNumber(formData.cep, '#####-###');

		$.ajax({
			type: 'POST',
			url: 'http://localhost:8080/usuarios',
			data: JSON.stringify(formData),
			contentType: 'application/json',
			success: function(response) {
				$('#success-message').show();

				// Limpar os campos após o cadastro
				$('#nome').val('');
				$('#email').val('');
				$('#tipo').val('fisica');
				cpfInput.val('');
				cnpjInput.val('');
				$('#cep').val('');
				$('#endereco').val('');
				$('#complemento').val('');
				$('#bairro').val('');
				$('#cidade').val('');
				$('#estado').val('');

				setTimeout(function() {
					$('#success-message').fadeOut();
				}, 3000);
			},
			error: function() {
				console.error('Erro ao comunicar com o servidor.');
			}
		});
	});


	// Formatar nome cpf cnpj e cep
	$('#nome').on('input', function() {
		var sanitizedInput = $(this).val().replace(/[^a-zA-Z\s]/g, ''); // Remove caracteres não-alfabéticos
		$(this).val(formatName(sanitizedInput));
	});
	$('#cpf').on('input', function() {
		$(this).val(formatNumber($(this).val(), '###.###.###-##'));
	});

	$('#cnpj').on('input', function() {
		$(this).val(formatNumber($(this).val(), '##.###.###/####-##'));
	});

	$('#cep').on('input', function() {
		$(this).val(formatNumber($(this).val(), '#####-###'));
	});




	// Função para carregar todos os usuários.
	function carregarUsuarios() {
		$.ajax({
			url: 'http://localhost:8080/usuarios',
			dataType: 'json',
			success: function(data) {
				ordenarTabela(data);
				var tbody = $('#table-body');
				tbody.empty();

				data.forEach(function(item) {
					var newRow = $("<tr>");
					newRow.append($("<td>").text(item.nome));
					newRow.append($("<td>").text(item.email));
					newRow.append($("<td>").text(item.cpf));

					var actionsCell = criarBotoesAcoes(item.id);
					newRow.append(actionsCell);

					tbody.append(newRow);
				});
			},
			error: function() {
				console.error('Erro ao carregar dados do backend.');
			}
		});
	}

	// Chama a função para carregar os usuários ao carregar a página.
	carregarUsuarios();


	// Manipulador de evento para pesquisar usuários.
	$('#btn-pesquisar').click(function() {
		var searchNome = $('#search-nome').val();
		var searchCpf = $('#search-cpf').val();

		$.ajax({
			url: 'http://localhost:8080/usuarios/buscar',
			data: {
				nome: searchNome,
				cpf: searchCpf
			},
			dataType: 'json',
			success: function(data) {

				$('#search-nome').val('');
				$('#search-cpf').val('');

				ordenarTabela(data);
				var tbody = $('#table-body');
				tbody.empty(); // Limpa a tabela antes de carregar os resultados da pesquisa

				data.forEach(function(item) {
					var newRow = $("<tr>");
					newRow.append($("<td>").text(item.nome));
					newRow.append($("<td>").text(item.email));
					newRow.append($("<td>").text(item.cpf));
					newRow.append(criarBotoesAcoes(item.id)); // Adicionar os botões de ação diretamente

					tbody.append(newRow);
				});
			},
			error: function() {
				console.error('Erro ao carregar dados da pesquisa.');
			}
		});
	});
	// formatar input de pesquisa cpf
	$('#search-cpf').on('input', function() {
		$(this).val(formatNumber($(this).val(), '###.###.###-##'));
	});


	/// Função para criar botões de ação com o ID do usuário.
	function criarBotoesAcoes(userId) {
		var actionsCell = $("<td>");
		var editButton = $("<button>").text("Editar").addClass("edit-button");
		var deleteButton = $("<button>").text("Excluir").addClass("delete-button");

		// Salva o ID do usuário nos atributos dos botões
		editButton.data("user-id", userId);
		deleteButton.data("user-id", userId);

		actionsCell.append(editButton, " | ", deleteButton);
		return actionsCell;
	}

	// Manipulador de evento para o botão "Editar".
	$(document).on("click", ".edit-button", function() {
		var userId = $(this).data("user-id");
		var row = $(this).closest("tr");
		var nome = row.find("td:eq(0)").text();
		var email = row.find("td:eq(1)").text();
		var cpf = row.find("td:eq(2)").text();

		$("#edit-nome").val(nome);
		$("#edit-email").val(email);
		$("#edit-cpf").val(cpf);

		// Atualizar o formulário de edição com o ID do usuário
		$("#edit-form").data("user-id", userId);

		// Exibir o popup de edição
		$(".overlay").show();
		togglePopup("edit-popup");
	});


	// Manipulador de evento para o botão "Salvar Edições".
	$("#save-edit").click(function(e) {
		e.preventDefault(); // Impede o envio do formulário

		var userId = $("#edit-form").data("user-id");
		var email = $("#edit-email").val();
		var parts = email.split("@");

		if (parts.length !== 2 || parts[1].trim() === "") {
			console.error("Email inválido.");
			return;
		}

		var cpfInput = $("#edit-cpf");
		var cpf = cpfInput.val().replace(/[^\d]/g, '');

		if (cpf.length !== 11) {
			alert("CPF deve conter 11 dígitos.");
			return;
		}

		var formData = {
			nome: formatName($("#edit-nome").val()),
			email: email,
			cpf: formatNumber(cpf, '###.###.###-##')
		};

		$.ajax({
			type: "PATCH",
			url: "http://localhost:8080/usuarios/" + userId,
			data: JSON.stringify(formData),
			contentType: "application/json",
			success: function(response) {
				if (cpf.length === 11) { // Verifica se o CPF tem 11 dígitos antes de fechar o popup
					console.log("Sucesso na atualização!");
					carregarUsuarios();
					togglePopup("edit-popup");
					$(".overlay").hide();
				} else {
					alert("CPF deve conter 11 dígitos.");
				}
			},
			error: function() {
				console.error("Erro ao atualizar o usuário.");
			}
		});
	});




	// Formatar nome e cpf do popup de editar
	$('#edit-nome').on('input', function() {
		var sanitizedInput = $(this).val().replace(/[^a-zA-Z\s]/g, ''); // Remove caracteres não-alfabéticos
		$(this).val(formatName(sanitizedInput));
	});
	$('#edit-cpf').on('input', function() {
		$(this).val(formatNumber($(this).val(), '###.###.###-##'));
	});


	// Manipulador de evento para o botão "Cancelar" no popup de edição.
	$("#cancel-edit").click(function() {
		$("#edit-popup").hide();
		$(".overlay").hide();
	});


	// Manipulador de evento para o botão "Excluir".
	$(document).on("click", ".delete-button", function() {
		var userId = $(this).data("user-id");

		if (confirm("Deseja excluir o usuário?")) {
			$.ajax({
				type: "DELETE",
				url: "http://localhost:8080/usuarios/" + userId,
				success: function(response) {
					carregarUsuarios();
				},
				error: function() {
					console.error("Erro ao excluir o usuário.");
				}
			});
		}
	});


	// Manipulador de evento para atualizar a tabela.
	$('#btn-atualizar').click(function() {
		carregarUsuarios();
	});

	var tabelaOrdenadaAscendente = true;
	function ordenarTabela(data) {
		data.sort(function(a, b) {
			return a.nome.localeCompare(b.nome);
		});

		if (!tabelaOrdenadaAscendente) {
			data.reverse();
		}

		var tbody = $('#table-body');
		tbody.empty();

		$.each(data, function(_, item) {
			var newRow = $("<tr>");
			newRow.append($("<td>").text(item.nome));
			newRow.append($("<td>").text(item.email));
			newRow.append($("<td>").text(item.cpf));
			newRow.append(criarBotoesAcoes(item.id));
			tbody.append(newRow);
		});
	}

	// Manipulador de evento de ordem alfabetica
	$('#btn-ordenar').click(function() {
		tabelaOrdenadaAscendente = !tabelaOrdenadaAscendente;
		var buttonText = tabelaOrdenadaAscendente ? "A - Z" : "Z - A";
		$(this).text(buttonText);

		if ($('#search-nome').val() || $('#search-cpf').val()) {
			$('#btn-pesquisar').click();
		} else {
			carregarUsuarios();
		}
	});


})