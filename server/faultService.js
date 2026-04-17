export function normalizeFaultCode(value) {
  return String(value).toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function mapFaultRecordRow(row) {
  return {
    brandId: row.brand_id,
    modelId: row.model_id,
    engineId: row.engine_id,
    faultCode: row.fault_code,
    title: row.title,
    summary: row.summary,
    severity: row.severity,
    part: {
      name: row.part_name,
      imageUrl: row.part_image_url,
      description: row.part_description,
    },
    location: {
      imageUrl: row.location_image_url,
      description: row.location_description,
    },
    likelyCauses: row.likely_causes ?? [],
    firstChecks: row.first_checks ?? [],
  };
}

export async function listOptions(pool) {
  const [brandsResult, modelsResult, enginesResult] = await Promise.all([
    pool.query("select id, name from brands order by name asc"),
    pool.query("select id, brand_id, name from models order by name asc"),
    pool.query("select id, model_id, name from engines order by name asc"),
  ]);

  return {
    brands: brandsResult.rows.map((row) => ({ id: row.id, name: row.name })),
    models: modelsResult.rows.map((row) => ({ id: row.id, brandId: row.brand_id, name: row.name })),
    engines: enginesResult.rows.map((row) => ({ id: row.id, modelId: row.model_id, name: row.name })),
  };
}

export async function getFaultRecord(pool, input) {
  const normalizedCode = normalizeFaultCode(input.faultCode);
  const result = await pool.query(
    `select brand_id, model_id, engine_id, fault_code, title, summary, severity,
            part_name, part_image_url, part_description,
            location_image_url, location_description,
            likely_causes, first_checks
       from fault_records
      where brand_id = $1 and model_id = $2 and engine_id = $3 and fault_code = $4
      limit 1`,
    [input.brandId, input.modelId, input.engineId, normalizedCode],
  );

  if (result.rowCount === 0) {
    return null;
  }

  return mapFaultRecordRow(result.rows[0]);
}
