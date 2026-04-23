package ecom.web.rest;

import ecom.domain.Crise;
import ecom.repository.CriseRepository;
import ecom.service.CriseService;
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
 * REST controller for managing {@link ecom.domain.Crise}.
 */
@RestController
@RequestMapping("/api/crises")
public class CriseResource {

    private static final Logger LOG = LoggerFactory.getLogger(CriseResource.class);

    private static final String ENTITY_NAME = "crise";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CriseService criseService;

    private final CriseRepository criseRepository;

    public CriseResource(CriseService criseService, CriseRepository criseRepository) {
        this.criseService = criseService;
        this.criseRepository = criseRepository;
    }

    /**
     * {@code POST  /crises} : Create a new crise.
     *
     * @param crise the crise to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new crise, or with status {@code 400 (Bad Request)} if the crise has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Crise> createCrise(@Valid @RequestBody Crise crise) throws URISyntaxException {
        LOG.debug("REST request to save Crise : {}", crise);
        if (crise.getId() != null) {
            throw new BadRequestAlertException("A new crise cannot already have an ID", ENTITY_NAME, "idexists");
        }
        crise = criseService.save(crise);
        return ResponseEntity.created(new URI("/api/crises/" + crise.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, crise.getId().toString()))
            .body(crise);
    }

    /**
     * {@code PUT  /crises/:id} : Updates an existing crise.
     *
     * @param id the id of the crise to save.
     * @param crise the crise to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated crise,
     * or with status {@code 400 (Bad Request)} if the crise is not valid,
     * or with status {@code 500 (Internal Server Error)} if the crise couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Crise> updateCrise(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Crise crise)
        throws URISyntaxException {
        LOG.debug("REST request to update Crise : {}, {}", id, crise);
        if (crise.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, crise.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!criseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        crise = criseService.update(crise);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, crise.getId().toString()))
            .body(crise);
    }

    /**
     * {@code PATCH  /crises/:id} : Partial updates given fields of an existing crise, field will ignore if it is null
     *
     * @param id the id of the crise to save.
     * @param crise the crise to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated crise,
     * or with status {@code 400 (Bad Request)} if the crise is not valid,
     * or with status {@code 404 (Not Found)} if the crise is not found,
     * or with status {@code 500 (Internal Server Error)} if the crise couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Crise> partialUpdateCrise(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Crise crise
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Crise partially : {}, {}", id, crise);
        if (crise.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, crise.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!criseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Crise> result = criseService.partialUpdate(crise);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, crise.getId().toString())
        );
    }

    /**
     * {@code GET  /crises} : get all the crises.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of crises in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Crise>> getAllCrises(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Crises");
        Page<Crise> page = criseService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /crises/:id} : get the "id" crise.
     *
     * @param id the id of the crise to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the crise, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Crise> getCrise(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Crise : {}", id);
        Optional<Crise> crise = criseService.findOne(id);
        return ResponseUtil.wrapOrNotFound(crise);
    }

    /**
     * {@code DELETE  /crises/:id} : delete the "id" crise.
     *
     * @param id the id of the crise to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCrise(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Crise : {}", id);
        criseService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
