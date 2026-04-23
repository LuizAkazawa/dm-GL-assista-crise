package ecom.web.rest;

import ecom.domain.Demande;
import ecom.repository.DemandeRepository;
import ecom.service.DemandeService;
import ecom.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link ecom.domain.Demande}.
 */
@RestController
@RequestMapping("/api/demandes")
public class DemandeResource {

    private static final Logger LOG = LoggerFactory.getLogger(DemandeResource.class);

    private static final String ENTITY_NAME = "demande";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DemandeService demandeService;

    private final DemandeRepository demandeRepository;

    public DemandeResource(DemandeService demandeService, DemandeRepository demandeRepository) {
        this.demandeService = demandeService;
        this.demandeRepository = demandeRepository;
    }

    /**
     * {@code POST  /demandes} : Create a new demande.
     *
     * @param demande the demande to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new demande, or with status {@code 400 (Bad Request)} if the demande has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Demande> createDemande(@Valid @RequestBody Demande demande) throws URISyntaxException {
        LOG.debug("REST request to save Demande : {}", demande);
        if (demande.getId() != null) {
            throw new BadRequestAlertException("A new demande cannot already have an ID", ENTITY_NAME, "idexists");
        }
        demande = demandeService.save(demande);
        return ResponseEntity.created(new URI("/api/demandes/" + demande.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, demande.getId().toString()))
            .body(demande);
    }

    /**
     * {@code PUT  /demandes/:id} : Updates an existing demande.
     *
     * @param id the id of the demande to save.
     * @param demande the demande to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated demande,
     * or with status {@code 400 (Bad Request)} if the demande is not valid,
     * or with status {@code 500 (Internal Server Error)} if the demande couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Demande> updateDemande(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Demande demande
    ) throws URISyntaxException {
        LOG.debug("REST request to update Demande : {}, {}", id, demande);
        if (demande.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, demande.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!demandeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        demande = demandeService.update(demande);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, demande.getId().toString()))
            .body(demande);
    }

    /**
     * {@code PATCH  /demandes/:id} : Partial updates given fields of an existing demande, field will ignore if it is null
     *
     * @param id the id of the demande to save.
     * @param demande the demande to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated demande,
     * or with status {@code 400 (Bad Request)} if the demande is not valid,
     * or with status {@code 404 (Not Found)} if the demande is not found,
     * or with status {@code 500 (Internal Server Error)} if the demande couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Demande> partialUpdateDemande(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Demande demande
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Demande partially : {}, {}", id, demande);
        if (demande.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, demande.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!demandeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Demande> result = demandeService.partialUpdate(demande);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, demande.getId().toString())
        );
    }

    /**
     * {@code GET  /demandes} : get all the demandes.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of demandes in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Demande>> getAllDemandes(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get a page of Demandes");
        Page<Demande> page;
        if (eagerload) {
            page = demandeService.findAllWithEagerRelationships(pageable);
        } else {
            page = demandeService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /demandes/:id} : get the "id" demande.
     *
     * @param id the id of the demande to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the demande, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Demande> getDemande(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Demande : {}", id);
        Optional<Demande> demande = demandeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(demande);
    }

    /**
     * {@code DELETE  /demandes/:id} : delete the "id" demande.
     *
     * @param id the id of the demande to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDemande(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Demande : {}", id);
        demandeService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
