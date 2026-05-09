/**
 * Utilidades de validación de datos
 */

export const parsePositiveId = (value: string, fieldName: string): number => {
    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
        throw new Error(`${fieldName} debe ser un numero entero positivo`);
    }

    return parsedValue;
};

export const parseOptionalPositiveId = (
    value: string | undefined,
    // fieldName intentionally unused - for API consistency with parsePositiveId
    _fieldName?: string,
): number | null => {
    if (value === undefined || value === null) {
        return null;
    }

    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue) || parsedValue <= 0) {
        return null;
    }

    return parsedValue;
};

export const parseJSON = async <T>(req: Request): Promise<T | null> => {
    try {
        return (await req.json()) as T;
    } catch {
        return null;
    }
};