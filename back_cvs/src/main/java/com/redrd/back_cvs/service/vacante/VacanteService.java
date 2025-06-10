package com.redrd.back_cvs.service.vacante;

import com.redrd.back_cvs.exceptions.ResourceNotFoundException;
import com.redrd.back_cvs.model.Vacante;
import com.redrd.back_cvs.repository.VacanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class VacanteService implements IVacanteService {

    private final VacanteRepository vacanteRepository;

    @Override
    public List<Vacante> findAll() {
        return vacanteRepository.findAllWithRequisitos();
    }

    @Override
    public Vacante obtnerVacanteId(UUID vacanteId) {
        return vacanteRepository.findById(vacanteId)
                .orElseThrow(() -> new ResourceNotFoundException("Vacante no disponible con Id: " + vacanteId));
    }

    @Override
    public Optional<Vacante> findById(UUID id) {
        return vacanteRepository.findById(id);
    }

    @Override
    public Vacante save(Vacante vacante) {
        return vacanteRepository.save(vacante);
    }

    @Override
    public Vacante update(UUID id, Vacante vacante) {
        vacante.setId(id);
        return vacanteRepository.save(vacante);
    }

    @Override
    public void delete(UUID id) {
        vacanteRepository.findById(id).ifPresentOrElse(vacanteRepository :: delete, () -> {
            throw new ResourceNotFoundException("Usuario no encontrado");
        });
    }

    @Override
    public List<Vacante> findByEstado(String estado) {
        return vacanteRepository.findByEstado(estado);
    }

    @Override
    public List<Vacante> findByArea(String area) {
        return vacanteRepository.findByArea(area);
    }
}
