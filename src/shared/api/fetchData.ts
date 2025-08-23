import {z} from "zod";
import {myApiFetch} from "./myApiFetch.ts";
import {normalizeError} from "../services/normalizeError.ts";
import {logger} from "../services/logger.ts";

export async function fetchData<RawDto, ParsedType, MappedType>(
    endpoint: string,
    schema: z.ZodSchema<ParsedType[]>,
    mapper: (item: ParsedType) => MappedType
): Promise<MappedType[]> {
    logger.debug('fetchData called with endpoint:', endpoint);
    try {
        const rawData: Awaited<RawDto[]> = await myApiFetch(endpoint);
        logger.debug('Received data:', rawData);
        const parsedData = schema.parse(rawData);
        return parsedData.map(mapper);
    } catch (error: unknown) {
        const normalizedError = normalizeError(error);
        throw normalizedError;
    }
}