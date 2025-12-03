import api from "./api";

interface ValidationError {
  type: "missing_field" | "extra_field" | "wrong_type";
  field: string;
  expectedType?: string;
  receivedType?: string;
}

async function reportError(message: string): Promise<void> {
  try {
    await api.post("/error", { message });
  } catch (error) {
    console.error("Failed to report error to server:", error);
  }
}

function getType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function validateFields(
  data: Record<string, unknown>,
  expectedFields: Record<string, string>
): ValidationError[] {
  const errors: ValidationError[] = [];
  const dataKeys = Object.keys(data);
  const expectedKeys = Object.keys(expectedFields);

  for (const key of expectedKeys) {
    if (!(key in data)) {
      errors.push({
        type: "missing_field",
        field: key,
      });
    }
  }

  for (const key of dataKeys) {
    if (!(key in expectedFields)) {
      errors.push({
        type: "extra_field",
        field: key,
      });
    }
  }

  // for (const key of expectedKeys) {
  //   if (key in data) {
  //     const expectedType = expectedFields[key];
  //     const receivedType = getType(data[key]);
  //
  //     if (expectedType === "number" && receivedType === "null") {
  //       continue;
  //     }
  //
  //     if (expectedType !== receivedType) {
  //       errors.push({
  //         type: "wrong_type",
  //         field: key,
  //         expectedType,
  //         receivedType,
  //       });
  //     }
  //   }
  // }

  return errors;
}

async function reportValidationErrors(
  errors: ValidationError[],
  endpoint: string
): Promise<void> {
  for (const error of errors) {
    let message = "";

    switch (error.type) {
      case "missing_field":
        message = `Index '${error.field}' not found in server data. Endpoint: ${endpoint}`;
        break;
      case "extra_field":
        message = `Unexpected index '${error.field}' found in server data. Endpoint: ${endpoint}`;
        break;
      case "wrong_type":
        message = `Wrong type for field '${error.field}'. Expected '${error.expectedType}', received '${error.receivedType}'. Endpoint: ${endpoint}`;
        break;
    }

    await reportError(message);
  }
}

const loginResponseFields: Record<string, string> = {
  token: "string",
  expires_in: "number",
};

export async function validateLoginResponse(
  data: unknown,
  endpoint: string = "POST /login"
): Promise<boolean> {
  if (typeof data !== "object" || data === null) {
    await reportError(
      `Invalid response format. Expected object. Endpoint: ${endpoint}`
    );
    return false;
  }

  const errors = validateFields(
    data as Record<string, unknown>,
    loginResponseFields
  );

  if (errors.length > 0) {
    await reportValidationErrors(errors, endpoint);
    return false;
  }

  return true;
}

const messageResponseFields: Record<string, string> = {
  message: "string",
};

export async function validateMessageResponse(
  data: unknown,
  endpoint: string
): Promise<boolean> {
  if (typeof data !== "object" || data === null) {
    await reportError(
      `Invalid response format. Expected object. Endpoint: ${endpoint}`
    );
    return false;
  }

  const errors = validateFields(
    data as Record<string, unknown>,
    messageResponseFields
  );

  if (errors.length > 0) {
    await reportValidationErrors(errors, endpoint);
    return false;
  }

  return true;
}

const companyResponseFields: Record<string, string> = {
  name: "string",
  business: "string",
  username: "string",
  street: "string",
  number: "string",
  city: "string",
  state: "string",
  phone: "string",
  email: "string",
};

export async function validateCompanyResponse(
  data: unknown,
  endpoint: string = "GET /companies/{company_id}"
): Promise<boolean> {
  if (typeof data !== "object" || data === null) {
    await reportError(
      `Invalid response format. Expected object. Endpoint: ${endpoint}`
    );
    return false;
  }

  const errors = validateFields(
    data as Record<string, unknown>,
    companyResponseFields
  );

  if (errors.length > 0) {
    await reportValidationErrors(errors, endpoint);
    return false;
  }

  return true;
}

const userResponseFields: Record<string, string> = {
  name: "string",
  username: "string",
  email: "string",
  phone: "string",
  experience: "string",
  education: "string",
};

export async function validateUserResponse(
  data: unknown,
  endpoint: string = "GET /users/{user_id}"
): Promise<boolean> {
  if (typeof data !== "object" || data === null) {
    await reportError(
      `Invalid response format. Expected object. Endpoint: ${endpoint}`
    );
    return false;
  }

  const errors = validateFields(
    data as Record<string, unknown>,
    userResponseFields
  );

  if (errors.length > 0) {
    await reportValidationErrors(errors, endpoint);
    return false;
  }

  return true;
}

const jobResponseFields: Record<string, string> = {
  job_id: "number",
  title: "string",
  area: "string",
  description: "string",
  company: "string",
  city: "string",
  state: "string",
  contact: "string",
  salary: "number",
};

export async function validateJobResponse(
  data: unknown,
  endpoint: string = "GET /jobs/{job_id}"
): Promise<boolean> {
  if (typeof data !== "object" || data === null) {
    await reportError(
      `Invalid response format. Expected object. Endpoint: ${endpoint}`
    );
    return false;
  }

  const errors = validateFields(
    data as Record<string, unknown>,
    jobResponseFields
  );

  if (errors.length > 0) {
    await reportValidationErrors(errors, endpoint);
    return false;
  }

  return true;
}

const jobItemFields: Record<string, string> = {
  job_id: "number",
  title: "string",
  area: "string",
  company: "string",
  description: "string",
  state: "string",
  city: "string",
  salary: "number",
  contact: "string",
};

export async function validateJobsSearchResponse(
  data: unknown,
  endpoint: string = "POST /jobs/search"
): Promise<boolean> {
  if (typeof data !== "object" || data === null) {
    await reportError(
      `Invalid response format. Expected object. Endpoint: ${endpoint}`
    );
    return false;
  }

  const response = data as Record<string, unknown>;

  if (!("items" in response)) {
    await reportError(
      `Index 'items' not found in server data. Endpoint: ${endpoint}`
    );
    return false;
  }

  if (!Array.isArray(response.items)) {
    await reportError(
      `Wrong type for field 'items'. Expected 'array', received '${getType(
        response.items
      )}'. Endpoint: ${endpoint}`
    );
    return false;
  }

  for (let i = 0; i < response.items.length; i++) {
    const item = response.items[i] as Record<string, unknown>;
    const errors = validateFields(item, jobItemFields);

    if (errors.length > 0) {
      await reportValidationErrors(
        errors.map((e) => ({ ...e, field: `items[${i}].${e.field}` })),
        endpoint
      );
      return false;
    }
  }

  return true;
}

export async function validateCompanyJobsResponse(
  data: unknown,
  endpoint: string = "POST /companies/{company_id}/jobs"
): Promise<boolean> {
  return validateJobsSearchResponse(data, endpoint);
}

const userApplicationItemFields: Record<string, string> = {
  job_id: "number",
  title: "string",
  area: "string",
  company: "string",
  description: "string",
  state: "string",
  city: "string",
  salary: "number",
  contact: "string",
  feedback: "string",
};

export async function validateUserApplicationsResponse(
  data: unknown,
  endpoint: string = "GET /users/{user_id}/jobs"
): Promise<boolean> {
  if (typeof data !== "object" || data === null) {
    await reportError(
      `Invalid response format. Expected object. Endpoint: ${endpoint}`
    );
    return false;
  }

  const response = data as Record<string, unknown>;

  if (!("items" in response)) {
    await reportError(
      `Index 'items' not found in server data. Endpoint: ${endpoint}`
    );
    return false;
  }

  if (!Array.isArray(response.items)) {
    await reportError(
      `Wrong type for field 'items'. Expected 'array', received '${getType(
        response.items
      )}'. Endpoint: ${endpoint}`
    );
    return false;
  }

  for (let i = 0; i < response.items.length; i++) {
    const item = response.items[i] as Record<string, unknown>;
    const errors = validateFields(item, userApplicationItemFields);

    if (errors.length > 0) {
      await reportValidationErrors(
        errors.map((e) => ({ ...e, field: `items[${i}].${e.field}` })),
        endpoint
      );
      return false;
    }
  }

  return true;
}

const jobCandidateItemFields: Record<string, string> = {
  user_id: "number",
  name: "string",
  email: "string",
  phone: "string",
  education: "string",
  experience: "string",
};

export async function validateJobCandidatesResponse(
  data: unknown,
  endpoint: string = "GET /companies/{company_id}/jobs/{job_id}"
): Promise<boolean> {
  if (typeof data !== "object" || data === null) {
    await reportError(
      `Invalid response format. Expected object. Endpoint: ${endpoint}`
    );
    return false;
  }

  const response = data as Record<string, unknown>;

  if (!("items" in response)) {
    await reportError(
      `Index 'items' not found in server data. Endpoint: ${endpoint}`
    );
    return false;
  }

  if (!Array.isArray(response.items)) {
    await reportError(
      `Wrong type for field 'items'. Expected 'array', received '${getType(
        response.items
      )}'. Endpoint: ${endpoint}`
    );
    return false;
  }

  for (let i = 0; i < response.items.length; i++) {
    const item = response.items[i] as Record<string, unknown>;
    const errors = validateFields(item, jobCandidateItemFields);

    if (errors.length > 0) {
      await reportValidationErrors(
        errors.map((e) => ({ ...e, field: `items[${i}].${e.field}` })),
        endpoint
      );
      return false;
    }
  }

  return true;
}
