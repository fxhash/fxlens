import { SafeParseError, SafeParseSuccess, z } from "zod"
import { FxParamDefinition, FxParamType } from "./types"

const ControllerTypeSchema = z.enum([
  "number",
  "color",
  "string",
  "boolean",
  "select",
])

const FxParamOptions_numberSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
})

const FxParamOptions_stringSchema = z.object({
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
})

const FxParamOptions_selectSchema = z.object({
  options: z.string().array().nonempty(),
})

export const BaseControllerDefinitionSchema = z.object({
  type: z.literal(ControllerTypeSchema.enum.color),
  id: z.string(),
  name: z.string().optional(),
  exposedAsFeature: z.string().optional(),
})

const StringControllerSchema = BaseControllerDefinitionSchema.extend({
  type: z.literal("string"),
  options: FxParamOptions_stringSchema.optional(),
  default: z.string(),
})

const NumberControllerSchema = BaseControllerDefinitionSchema.extend({
  type: z.literal("number"),
  options: FxParamOptions_numberSchema.optional(),
  default: z.number(),
})

const SelectControllerSchema = BaseControllerDefinitionSchema.extend({
  type: z.literal("select"),
  options: FxParamOptions_selectSchema.optional(),
  default: z.string(),
})

const BooleanControllerSchema = BaseControllerDefinitionSchema.extend({
  type: z.literal("boolean"),
  options: z.undefined(),
  default: z.boolean(),
})

const ColorControllerSchema = BaseControllerDefinitionSchema.extend({
  type: z.literal("color"),
  options: z.undefined(),
  default: z.string(),
})

const ControllerDefinitionSchema = z.union([
  StringControllerSchema,
  NumberControllerSchema,
  SelectControllerSchema,
  BooleanControllerSchema,
  ColorControllerSchema,
])

type ControllerDefinitionSchemaType = z.infer<typeof ControllerDefinitionSchema>
type ControllerSchemaType = z.infer<typeof ControllerTypeSchema>

const ControllerSchema = z.record(
  ControllerTypeSchema,
  ControllerDefinitionSchema
)

const controllerSchema = {
  number: NumberControllerSchema,
  color: ColorControllerSchema,
  string: StringControllerSchema,
  boolean: BooleanControllerSchema,
  select: SelectControllerSchema,
}

export function validateParameterDefinition(
  parameterDefinition: FxParamDefinition<FxParamType>
):
  | SafeParseError<ControllerDefinitionSchemaType>
  | SafeParseSuccess<ControllerDefinitionSchemaType>
  | undefined {
  return controllerSchema[parameterDefinition.type]?.safeParse(
    parameterDefinition
  )
}
