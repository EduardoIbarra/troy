import { TestBed, inject } from '@angular/core/testing';

import { MedidorService } from './medidor.service';

describe('MedidorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MedidorService]
    });
  });

  it('should be created', inject([MedidorService], (service: MedidorService) => {
    expect(service).toBeTruthy();
  }));
});
