import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContatoService } from '../contato.service';
import { DetalheContatoComponent } from '../detalhe-contato/detalhe-contato.component';
import { Contato } from './contato';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  formGroup: FormGroup;
  contatos: Contato[] = [];
  displayedColumns = ['foto', 'id', 'nome', 'email', 'favorito'];
  totalElementos = 0;
  pagina = 0;
  tamanho = 5;
  pageSizeOptions: number[] = [10];

  constructor(
    private service: ContatoService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBark: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.prepareForm();
    this.list(this.pagina, this.tamanho);
  }

  prepareForm() {
    this.formGroup = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    })
  }

  list(pagina, tamanho) {
    this.service.list(pagina, tamanho).subscribe(response => {
      this.contatos = response.content;
      this.totalElementos = response.totalElements;
      this.pagina = response.number;
    })
  }

  submit() {
    const formValues = this.formGroup.value;
    const contato: Contato = new Contato(formValues.nome, formValues.email);

    this.service.save(contato).subscribe(
      response => {
        /* opção para evitar consultar no banco quando não há paginação
        let lista: Contato[] = [... this.contatos, response]
        */
        this.list(this.pagina, this.tamanho);
        this.snackBark.open('Registro incluído com sucesso!', 'Sucesso', {
          duration: 2000
        })
        this.formGroup.reset();
      }
    )
  }

  favorite(contato: Contato) {
    this.service.favorite(contato).subscribe(response => {
      contato.favorito = !contato.favorito;
    })
  }

  upload(event, contato) {
    const files = event.target.files;
    if (files) {
      const foto = files[0];
      const formData: FormData = new FormData();
      formData.append('foto', foto);
      this.service.upload(contato, formData).subscribe(response => {
        this.list(this.pagina, this.tamanho);
      })
    }
  }

  detailContato(contato: Contato) {
    this.dialog.open(DetalheContatoComponent, {
      width: '400px',
      height: '400px',
      data: contato
    })
  }

  paginar(event: PageEvent) {
    this.pagina = event.pageIndex;
    this.list(this.pagina, this.tamanho);
  }

}
