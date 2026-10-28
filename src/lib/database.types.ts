
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "addresses": {
                  Row: {
                    "city": string,"created_at": string,"id": string,"is_default": boolean,"label": string,"line1": string,"line2": string | null,"phone": string | null,"postal_code": string,"state": string | null,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "city": string,"created_at"?: string,"id"?: string,"is_default"?: boolean,"label"?: string,"line1": string,"line2"?: string | null,"phone"?: string | null,"postal_code": string,"state"?: string | null,"user_id": string
                  }
                  Update: {
                    "city"?: string,"created_at"?: string,"id"?: string,"is_default"?: boolean,"label"?: string,"line1"?: string,"line2"?: string | null,"phone"?: string | null,"postal_code"?: string,"state"?: string | null,"user_id"?: string
                  }
                  Relationships: [
                    
                  ]
                },"animation_assets": {
                  Row: {
                    "bucket": string,"created_at": string,"file_name": string,"height": number | null,"id": string,"kind": string,"mime_type": string,"owner_id": string,"project_id": string | null,"public_url": string | null,"size_bytes": number,"storage_path": string,"width": number | null
                  }
                  ComputedFields: never
                  Insert: {
                    "bucket": string,"created_at"?: string,"file_name": string,"height"?: number | null,"id"?: string,"kind": string,"mime_type": string,"owner_id": string,"project_id"?: string | null,"public_url"?: string | null,"size_bytes": number,"storage_path": string,"width"?: number | null
                  }
                  Update: {
                    "bucket"?: string,"created_at"?: string,"file_name"?: string,"height"?: number | null,"id"?: string,"kind"?: string,"mime_type"?: string,"owner_id"?: string,"project_id"?: string | null,"public_url"?: string | null,"size_bytes"?: number,"storage_path"?: string,"width"?: number | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "animation_assets_project_id_fkey"
      columns: ["project_id"]
isOneToOne: false
      referencedRelation: "animation_projects"
      referencedColumns: ["id"]
    }
                  ]
                },"animation_exports": {
                  Row: {
                    "bucket": string | null,"completed_at": string | null,"created_at": string,"error_message": string | null,"format": Database["public"]['Enums']["export_format"],"fps": number,"frame_count": number | null,"height": number,"id": string,"progress": number,"project_id": string,"renderer": string,"requested_by": string,"size_bytes": number | null,"started_at": string | null,"status": Database["public"]['Enums']["export_status"],"storage_path": string | null,"width": number
                  }
                  ComputedFields: never
                  Insert: {
                    "bucket"?: string | null,"completed_at"?: string | null,"created_at"?: string,"error_message"?: string | null,"format": Database["public"]['Enums']["export_format"],"fps": number,"frame_count"?: number | null,"height": number,"id"?: string,"progress"?: number,"project_id": string,"renderer"?: string,"requested_by": string,"size_bytes"?: number | null,"started_at"?: string | null,"status"?: Database["public"]['Enums']["export_status"],"storage_path"?: string | null,"width": number
                  }
                  Update: {
                    "bucket"?: string | null,"completed_at"?: string | null,"created_at"?: string,"error_message"?: string | null,"format"?: Database["public"]['Enums']["export_format"],"fps"?: number,"frame_count"?: number | null,"height"?: number,"id"?: string,"progress"?: number,"project_id"?: string,"renderer"?: string,"requested_by"?: string,"size_bytes"?: number | null,"started_at"?: string | null,"status"?: Database["public"]['Enums']["export_status"],"storage_path"?: string | null,"width"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "animation_exports_project_id_fkey"
      columns: ["project_id"]
isOneToOne: false
      referencedRelation: "animation_projects"
      referencedColumns: ["id"]
    }
                  ]
                },"animation_projects": {
                  Row: {
                    "aspect_ratio": string,"business_id": string | null,"category_slug": string | null,"created_at": string,"description": string | null,"document": NonNullable<Json>,"document_version": number,"fps": number,"height": number,"id": string,"last_opened_at": string | null,"owner_id": string,"status": Database["public"]['Enums']["project_status"],"template_slug": string | null,"thumbnail_url": string | null,"title": string,"updated_at": string,"width": number
                  }
                  ComputedFields: never
                  Insert: {
                    "aspect_ratio"?: string,"business_id"?: string | null,"category_slug"?: string | null,"created_at"?: string,"description"?: string | null,"document"?: NonNullable<Json>,"document_version"?: number,"fps"?: number,"height"?: number,"id"?: string,"last_opened_at"?: string | null,"owner_id": string,"status"?: Database["public"]['Enums']["project_status"],"template_slug"?: string | null,"thumbnail_url"?: string | null,"title"?: string,"updated_at"?: string,"width"?: number
                  }
                  Update: {
                    "aspect_ratio"?: string,"business_id"?: string | null,"category_slug"?: string | null,"created_at"?: string,"description"?: string | null,"document"?: NonNullable<Json>,"document_version"?: number,"fps"?: number,"height"?: number,"id"?: string,"last_opened_at"?: string | null,"owner_id"?: string,"status"?: Database["public"]['Enums']["project_status"],"template_slug"?: string | null,"thumbnail_url"?: string | null,"title"?: string,"updated_at"?: string,"width"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "animation_projects_business_id_fkey"
      columns: ["business_id"]
isOneToOne: false
      referencedRelation: "businesses"
      referencedColumns: ["id"]
    }
                  ]
                },"animation_scenes": {
                  Row: {
                    "created_at": string,"duration_ms": number,"id": string,"layer_count": number,"name": string,"project_id": string,"scene_key": string,"sort_order": number,"transition": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"duration_ms"?: number,"id"?: string,"layer_count"?: number,"name": string,"project_id": string,"scene_key": string,"sort_order"?: number,"transition"?: string
                  }
                  Update: {
                    "created_at"?: string,"duration_ms"?: number,"id"?: string,"layer_count"?: number,"name"?: string,"project_id"?: string,"scene_key"?: string,"sort_order"?: number,"transition"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "animation_scenes_project_id_fkey"
      columns: ["project_id"]
isOneToOne: false
      referencedRelation: "animation_projects"
      referencedColumns: ["id"]
    }
                  ]
                },"animation_templates": {
                  Row: {
                    "category_slug": string | null,"description": string | null,"is_active": boolean,"is_featured": boolean,"name": string,"slug": string,"sort_order": number,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "category_slug"?: string | null,"description"?: string | null,"is_active"?: boolean,"is_featured"?: boolean,"name": string,"slug": string,"sort_order"?: number,"updated_at"?: string
                  }
                  Update: {
                    "category_slug"?: string | null,"description"?: string | null,"is_active"?: boolean,"is_featured"?: boolean,"name"?: string,"slug"?: string,"sort_order"?: number,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"audit_logs": {
                  Row: {
                    "action": string,"actor_id": string | null,"created_at": string,"id": number,"ip_hash": string | null,"metadata": NonNullable<Json>,"target_id": string | null,"target_type": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "action": string,"actor_id"?: string | null,"created_at"?: string,"id"?: never,"ip_hash"?: string | null,"metadata"?: NonNullable<Json>,"target_id"?: string | null,"target_type"?: string | null
                  }
                  Update: {
                    "action"?: string,"actor_id"?: string | null,"created_at"?: string,"id"?: never,"ip_hash"?: string | null,"metadata"?: NonNullable<Json>,"target_id"?: string | null,"target_type"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"business_members": {
                  Row: {
                    "business_id": string,"created_at": string,"invited_by": string | null,"role": Database["public"]['Enums']["member_role"],"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "business_id": string,"created_at"?: string,"invited_by"?: string | null,"role"?: Database["public"]['Enums']["member_role"],"user_id": string
                  }
                  Update: {
                    "business_id"?: string,"created_at"?: string,"invited_by"?: string | null,"role"?: Database["public"]['Enums']["member_role"],"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "business_members_business_id_fkey"
      columns: ["business_id"]
isOneToOne: false
      referencedRelation: "businesses"
      referencedColumns: ["id"]
    }
                  ]
                },"business_verification_requests": {
                  Row: {
                    "business_id": string,"created_at": string,"document_urls": (string)[],"fssai_license": string | null,"gstin": string | null,"id": string,"legal_name": string,"notes": string | null,"registration_number": string | null,"review_notes": string | null,"reviewed_at": string | null,"reviewed_by": string | null,"status": Database["public"]['Enums']["verification_status"],"submitted_by": string
                  }
                  ComputedFields: never
                  Insert: {
                    "business_id": string,"created_at"?: string,"document_urls"?: (string)[],"fssai_license"?: string | null,"gstin"?: string | null,"id"?: string,"legal_name": string,"notes"?: string | null,"registration_number"?: string | null,"review_notes"?: string | null,"reviewed_at"?: string | null,"reviewed_by"?: string | null,"status"?: Database["public"]['Enums']["verification_status"],"submitted_by": string
                  }
                  Update: {
                    "business_id"?: string,"created_at"?: string,"document_urls"?: (string)[],"fssai_license"?: string | null,"gstin"?: string | null,"id"?: string,"legal_name"?: string,"notes"?: string | null,"registration_number"?: string | null,"review_notes"?: string | null,"reviewed_at"?: string | null,"reviewed_by"?: string | null,"status"?: Database["public"]['Enums']["verification_status"],"submitted_by"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "business_verification_requests_business_id_fkey"
      columns: ["business_id"]
isOneToOne: false
      referencedRelation: "businesses"
      referencedColumns: ["id"]
    }
                  ]
                },"businesses": {
                  Row: {
                    "accepts_orders": boolean,"address_line1": string | null,"address_line2": string | null,"city": string | null,"country": string,"cover_url": string | null,"created_at": string,"cuisines": (string)[],"description": string | null,"email": string | null,"id": string,"is_published": boolean,"latitude": number | null,"logo_url": string | null,"longitude": number | null,"name": string,"opening_hours": NonNullable<Json>,"owner_id": string,"phone": string | null,"postal_code": string | null,"price_level": number | null,"rating_avg": number,"rating_count": number,"slug": string,"state": string | null,"tagline": string | null,"type": Database["public"]['Enums']["business_type"],"updated_at": string,"upi_id": string | null,"verification_status": Database["public"]['Enums']["verification_status"],"website": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "accepts_orders"?: boolean,"address_line1"?: string | null,"address_line2"?: string | null,"city"?: string | null,"country"?: string,"cover_url"?: string | null,"created_at"?: string,"cuisines"?: (string)[],"description"?: string | null,"email"?: string | null,"id"?: string,"is_published"?: boolean,"latitude"?: number | null,"logo_url"?: string | null,"longitude"?: number | null,"name": string,"opening_hours"?: NonNullable<Json>,"owner_id": string,"phone"?: string | null,"postal_code"?: string | null,"price_level"?: number | null,"rating_avg"?: number,"rating_count"?: number,"slug": string,"state"?: string | null,"tagline"?: string | null,"type"?: Database["public"]['Enums']["business_type"],"updated_at"?: string,"upi_id"?: string | null,"verification_status"?: Database["public"]['Enums']["verification_status"],"website"?: string | null
                  }
                  Update: {
                    "accepts_orders"?: boolean,"address_line1"?: string | null,"address_line2"?: string | null,"city"?: string | null,"country"?: string,"cover_url"?: string | null,"created_at"?: string,"cuisines"?: (string)[],"description"?: string | null,"email"?: string | null,"id"?: string,"is_published"?: boolean,"latitude"?: number | null,"logo_url"?: string | null,"longitude"?: number | null,"name"?: string,"opening_hours"?: NonNullable<Json>,"owner_id"?: string,"phone"?: string | null,"postal_code"?: string | null,"price_level"?: number | null,"rating_avg"?: number,"rating_count"?: number,"slug"?: string,"state"?: string | null,"tagline"?: string | null,"type"?: Database["public"]['Enums']["business_type"],"updated_at"?: string,"upi_id"?: string | null,"verification_status"?: Database["public"]['Enums']["verification_status"],"website"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"favorites": {
                  Row: {
                    "created_at": string,"target_id": string,"target_type": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"target_id": string,"target_type": string,"user_id": string
                  }
                  Update: {
                    "created_at"?: string,"target_id"?: string,"target_type"?: string,"user_id"?: string
                  }
                  Relationships: [
                    
                  ]
                },"food_categories": {
                  Row: {
                    "created_at": string,"description": string | null,"emoji": string | null,"id": string,"is_active": boolean,"name": string,"slug": string,"sort_order": number
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"description"?: string | null,"emoji"?: string | null,"id"?: string,"is_active"?: boolean,"name": string,"slug": string,"sort_order"?: number
                  }
                  Update: {
                    "created_at"?: string,"description"?: string | null,"emoji"?: string | null,"id"?: string,"is_active"?: boolean,"name"?: string,"slug"?: string,"sort_order"?: number
                  }
                  Relationships: [
                    
                  ]
                },"inquiries": {
                  Row: {
                    "business_id": string,"created_at": string,"customer_id": string | null,"email": string,"event_date": string | null,"guest_count": number | null,"id": string,"message": string,"name": string,"phone": string | null,"replied_at": string | null,"reply": string | null,"status": Database["public"]['Enums']["inquiry_status"],"subject": string
                  }
                  ComputedFields: never
                  Insert: {
                    "business_id": string,"created_at"?: string,"customer_id"?: string | null,"email": string,"event_date"?: string | null,"guest_count"?: number | null,"id"?: string,"message": string,"name": string,"phone"?: string | null,"replied_at"?: string | null,"reply"?: string | null,"status"?: Database["public"]['Enums']["inquiry_status"],"subject": string
                  }
                  Update: {
                    "business_id"?: string,"created_at"?: string,"customer_id"?: string | null,"email"?: string,"event_date"?: string | null,"guest_count"?: number | null,"id"?: string,"message"?: string,"name"?: string,"phone"?: string | null,"replied_at"?: string | null,"reply"?: string | null,"status"?: Database["public"]['Enums']["inquiry_status"],"subject"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "inquiries_business_id_fkey"
      columns: ["business_id"]
isOneToOne: false
      referencedRelation: "businesses"
      referencedColumns: ["id"]
    }
                  ]
                },"menu_items": {
                  Row: {
                    "allergens": (string)[],"business_id": string,"category_id": string | null,"created_at": string,"currency": string,"customization_options": NonNullable<Json>,"description": string | null,"diet": Database["public"]['Enums']["diet_label"] | null,"id": string,"image_url": string | null,"is_available": boolean,"name": string,"prep_time_minutes": number | null,"price_minor": number,"promo_animation_id": string | null,"sort_order": number,"spice_level": number | null,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "allergens"?: (string)[],"business_id": string,"category_id"?: string | null,"created_at"?: string,"currency"?: string,"customization_options"?: NonNullable<Json>,"description"?: string | null,"diet"?: Database["public"]['Enums']["diet_label"] | null,"id"?: string,"image_url"?: string | null,"is_available"?: boolean,"name": string,"prep_time_minutes"?: number | null,"price_minor": number,"promo_animation_id"?: string | null,"sort_order"?: number,"spice_level"?: number | null,"updated_at"?: string
                  }
                  Update: {
                    "allergens"?: (string)[],"business_id"?: string,"category_id"?: string | null,"created_at"?: string,"currency"?: string,"customization_options"?: NonNullable<Json>,"description"?: string | null,"diet"?: Database["public"]['Enums']["diet_label"] | null,"id"?: string,"image_url"?: string | null,"is_available"?: boolean,"name"?: string,"prep_time_minutes"?: number | null,"price_minor"?: number,"promo_animation_id"?: string | null,"sort_order"?: number,"spice_level"?: number | null,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "menu_items_business_id_fkey"
      columns: ["business_id"]
isOneToOne: false
      referencedRelation: "businesses"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "menu_items_category_id_fkey"
      columns: ["category_id"]
isOneToOne: false
      referencedRelation: "food_categories"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "menu_items_promo_fk"
      columns: ["promo_animation_id"]
isOneToOne: false
      referencedRelation: "published_animations"
      referencedColumns: ["id"]
    }
                  ]
                },"moderation_reports": {
                  Row: {
                    "created_at": string,"details": string | null,"id": string,"reason": string,"reporter_id": string | null,"resolution_notes": string | null,"resolved_at": string | null,"resolved_by": string | null,"status": Database["public"]['Enums']["report_status"],"target_id": string,"target_type": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"details"?: string | null,"id"?: string,"reason": string,"reporter_id"?: string | null,"resolution_notes"?: string | null,"resolved_at"?: string | null,"resolved_by"?: string | null,"status"?: Database["public"]['Enums']["report_status"],"target_id": string,"target_type": string
                  }
                  Update: {
                    "created_at"?: string,"details"?: string | null,"id"?: string,"reason"?: string,"reporter_id"?: string | null,"resolution_notes"?: string | null,"resolved_at"?: string | null,"resolved_by"?: string | null,"status"?: Database["public"]['Enums']["report_status"],"target_id"?: string,"target_type"?: string
                  }
                  Relationships: [
                    
                  ]
                },"notifications": {
                  Row: {
                    "body": string | null,"created_at": string,"id": string,"link": string | null,"read_at": string | null,"title": string,"type": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "body"?: string | null,"created_at"?: string,"id"?: string,"link"?: string | null,"read_at"?: string | null,"title": string,"type": string,"user_id": string
                  }
                  Update: {
                    "body"?: string | null,"created_at"?: string,"id"?: string,"link"?: string | null,"read_at"?: string | null,"title"?: string,"type"?: string,"user_id"?: string
                  }
                  Relationships: [
                    
                  ]
                },"order_items": {
                  Row: {
                    "created_at": string,"customizations": NonNullable<Json>,"id": string,"menu_item_id": string | null,"name_snapshot": string,"order_id": string,"quantity": number,"unit_price_minor": number
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"customizations"?: NonNullable<Json>,"id"?: string,"menu_item_id"?: string | null,"name_snapshot": string,"order_id": string,"quantity": number,"unit_price_minor": number
                  }
                  Update: {
                    "created_at"?: string,"customizations"?: NonNullable<Json>,"id"?: string,"menu_item_id"?: string | null,"name_snapshot"?: string,"order_id"?: string,"quantity"?: number,"unit_price_minor"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "order_items_menu_item_id_fkey"
      columns: ["menu_item_id"]
isOneToOne: false
      referencedRelation: "menu_items"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "order_items_order_id_fkey"
      columns: ["order_id"]
isOneToOne: false
      referencedRelation: "orders"
      referencedColumns: ["id"]
    }
                  ]
                },"orders": {
                  Row: {
                    "address_snapshot": Json | null,"business_id": string,"created_at": string,"currency": string,"customer_id": string,"delivery_fee_minor": number,"fulfilment": string,"id": string,"notes": string | null,"placed_at": string | null,"status": Database["public"]['Enums']["order_status"],"subtotal_minor": number,"tax_minor": number,"total_minor": number,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "address_snapshot"?: Json | null,"business_id": string,"created_at"?: string,"currency"?: string,"customer_id": string,"delivery_fee_minor"?: number,"fulfilment"?: string,"id"?: string,"notes"?: string | null,"placed_at"?: string | null,"status"?: Database["public"]['Enums']["order_status"],"subtotal_minor"?: number,"tax_minor"?: number,"total_minor"?: number,"updated_at"?: string
                  }
                  Update: {
                    "address_snapshot"?: Json | null,"business_id"?: string,"created_at"?: string,"currency"?: string,"customer_id"?: string,"delivery_fee_minor"?: number,"fulfilment"?: string,"id"?: string,"notes"?: string | null,"placed_at"?: string | null,"status"?: Database["public"]['Enums']["order_status"],"subtotal_minor"?: number,"tax_minor"?: number,"total_minor"?: number,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "orders_business_id_fkey"
      columns: ["business_id"]
isOneToOne: false
      referencedRelation: "businesses"
      referencedColumns: ["id"]
    }
                  ]
                },"payments": {
                  Row: {
                    "amount_minor": number,"created_at": string,"currency": string,"failure_reason": string | null,"id": string,"idempotency_key": string | null,"method": string | null,"mode": Database["public"]['Enums']["payment_mode"],"order_id": string | null,"provider": string,"provider_order_id": string | null,"provider_payment_id": string | null,"raw_event": Json | null,"status": Database["public"]['Enums']["payment_status"],"subscription_id": string | null,"updated_at": string,"user_id": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "amount_minor": number,"created_at"?: string,"currency"?: string,"failure_reason"?: string | null,"id"?: string,"idempotency_key"?: string | null,"method"?: string | null,"mode"?: Database["public"]['Enums']["payment_mode"],"order_id"?: string | null,"provider"?: string,"provider_order_id"?: string | null,"provider_payment_id"?: string | null,"raw_event"?: Json | null,"status"?: Database["public"]['Enums']["payment_status"],"subscription_id"?: string | null,"updated_at"?: string,"user_id"?: string | null
                  }
                  Update: {
                    "amount_minor"?: number,"created_at"?: string,"currency"?: string,"failure_reason"?: string | null,"id"?: string,"idempotency_key"?: string | null,"method"?: string | null,"mode"?: Database["public"]['Enums']["payment_mode"],"order_id"?: string | null,"provider"?: string,"provider_order_id"?: string | null,"provider_payment_id"?: string | null,"raw_event"?: Json | null,"status"?: Database["public"]['Enums']["payment_status"],"subscription_id"?: string | null,"updated_at"?: string,"user_id"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "payments_order_id_fkey"
      columns: ["order_id"]
isOneToOne: false
      referencedRelation: "orders"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "payments_subscription_id_fkey"
      columns: ["subscription_id"]
isOneToOne: false
      referencedRelation: "subscriptions"
      referencedColumns: ["id"]
    }
                  ]
                },"platform_settings": {
                  Row: {
                    "key": string,"updated_at": string,"updated_by": string | null,"value": NonNullable<Json>
                  }
                  ComputedFields: never
                  Insert: {
                    "key": string,"updated_at"?: string,"updated_by"?: string | null,"value": NonNullable<Json>
                  }
                  Update: {
                    "key"?: string,"updated_at"?: string,"updated_by"?: string | null,"value"?: NonNullable<Json>
                  }
                  Relationships: [
                    
                  ]
                },"profiles": {
                  Row: {
                    "avatar_url": string | null,"bio": string | null,"city": string | null,"created_at": string,"full_name": string,"id": string,"is_public": boolean,"onboarding_completed": boolean,"phone": string | null,"updated_at": string,"username": string | null,"website": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "avatar_url"?: string | null,"bio"?: string | null,"city"?: string | null,"created_at"?: string,"full_name"?: string,"id": string,"is_public"?: boolean,"onboarding_completed"?: boolean,"phone"?: string | null,"updated_at"?: string,"username"?: string | null,"website"?: string | null
                  }
                  Update: {
                    "avatar_url"?: string | null,"bio"?: string | null,"city"?: string | null,"created_at"?: string,"full_name"?: string,"id"?: string,"is_public"?: boolean,"onboarding_completed"?: boolean,"phone"?: string | null,"updated_at"?: string,"username"?: string | null,"website"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"published_animations": {
                  Row: {
                    "business_id": string | null,"category_slug": string | null,"description": string | null,"document": NonNullable<Json>,"fps": number,"height": number,"id": string,"is_featured": boolean,"is_hidden": boolean,"like_count": number,"owner_id": string,"project_id": string,"published_at": string,"slug": string,"thumbnail_url": string | null,"title": string,"updated_at": string,"view_count": number,"width": number
                  }
                  ComputedFields: never
                  Insert: {
                    "business_id"?: string | null,"category_slug"?: string | null,"description"?: string | null,"document": NonNullable<Json>,"fps": number,"height": number,"id"?: string,"is_featured"?: boolean,"is_hidden"?: boolean,"like_count"?: number,"owner_id": string,"project_id": string,"published_at"?: string,"slug": string,"thumbnail_url"?: string | null,"title": string,"updated_at"?: string,"view_count"?: number,"width": number
                  }
                  Update: {
                    "business_id"?: string | null,"category_slug"?: string | null,"description"?: string | null,"document"?: NonNullable<Json>,"fps"?: number,"height"?: number,"id"?: string,"is_featured"?: boolean,"is_hidden"?: boolean,"like_count"?: number,"owner_id"?: string,"project_id"?: string,"published_at"?: string,"slug"?: string,"thumbnail_url"?: string | null,"title"?: string,"updated_at"?: string,"view_count"?: number,"width"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "published_animations_business_id_fkey"
      columns: ["business_id"]
isOneToOne: false
      referencedRelation: "businesses"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "published_animations_project_id_fkey"
      columns: ["project_id"]
isOneToOne: true
      referencedRelation: "animation_projects"
      referencedColumns: ["id"]
    }
                  ]
                },"rate_limits": {
                  Row: {
                    "bucket": string,"count": number,"key": string,"window_start": string
                  }
                  ComputedFields: never
                  Insert: {
                    "bucket": string,"count"?: number,"key": string,"window_start": string
                  }
                  Update: {
                    "bucket"?: string,"count"?: number,"key"?: string,"window_start"?: string
                  }
                  Relationships: [
                    
                  ]
                },"reviews": {
                  Row: {
                    "author_id": string,"body": string | null,"business_id": string,"created_at": string,"id": string,"is_hidden": boolean,"is_verified_purchase": boolean,"order_id": string | null,"rating": number,"title": string | null,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "author_id": string,"body"?: string | null,"business_id": string,"created_at"?: string,"id"?: string,"is_hidden"?: boolean,"is_verified_purchase"?: boolean,"order_id"?: string | null,"rating": number,"title"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "author_id"?: string,"body"?: string | null,"business_id"?: string,"created_at"?: string,"id"?: string,"is_hidden"?: boolean,"is_verified_purchase"?: boolean,"order_id"?: string | null,"rating"?: number,"title"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "reviews_business_id_fkey"
      columns: ["business_id"]
isOneToOne: false
      referencedRelation: "businesses"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reviews_order_id_fkey"
      columns: ["order_id"]
isOneToOne: false
      referencedRelation: "orders"
      referencedColumns: ["id"]
    }
                  ]
                },"subscriptions": {
                  Row: {
                    "business_id": string | null,"cancel_at_period_end": boolean,"created_at": string,"current_period_end": string | null,"current_period_start": string | null,"id": string,"mode": Database["public"]['Enums']["payment_mode"],"plan": Database["public"]['Enums']["plan_code"],"provider": string | null,"provider_subscription_id": string | null,"status": Database["public"]['Enums']["subscription_status"],"updated_at": string,"user_id": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "business_id"?: string | null,"cancel_at_period_end"?: boolean,"created_at"?: string,"current_period_end"?: string | null,"current_period_start"?: string | null,"id"?: string,"mode"?: Database["public"]['Enums']["payment_mode"],"plan"?: Database["public"]['Enums']["plan_code"],"provider"?: string | null,"provider_subscription_id"?: string | null,"status"?: Database["public"]['Enums']["subscription_status"],"updated_at"?: string,"user_id"?: string | null
                  }
                  Update: {
                    "business_id"?: string | null,"cancel_at_period_end"?: boolean,"created_at"?: string,"current_period_end"?: string | null,"current_period_start"?: string | null,"id"?: string,"mode"?: Database["public"]['Enums']["payment_mode"],"plan"?: Database["public"]['Enums']["plan_code"],"provider"?: string | null,"provider_subscription_id"?: string | null,"status"?: Database["public"]['Enums']["subscription_status"],"updated_at"?: string,"user_id"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "subscriptions_business_id_fkey"
      columns: ["business_id"]
isOneToOne: false
      referencedRelation: "businesses"
      referencedColumns: ["id"]
    }
                  ]
                },"user_roles": {
                  Row: {
                    "created_at": string,"granted_by": string | null,"role": Database["public"]['Enums']["app_role"],"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"granted_by"?: string | null,"role": Database["public"]['Enums']["app_role"],"user_id": string
                  }
                  Update: {
                    "created_at"?: string,"granted_by"?: string | null,"role"?: Database["public"]['Enums']["app_role"],"user_id"?: string
                  }
                  Relationships: [
                    
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "consume_rate_limit":
{ Args: { "p_bucket": string,"p_key": string,"p_limit": number,"p_window_seconds": number }; Returns: boolean
                           },
"has_role":
{ Args: { "target_role": Database["public"]['Enums']["app_role"] }; Returns: boolean
                           },
"increment_animation_view":
{ Args: { "p_slug": string }; Returns: undefined
                           },
"is_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"is_business_member":
{ Args: { "min_role"?: Database["public"]['Enums']["member_role"],"target_business": string }; Returns: boolean
                           },
"log_audit":
{ Args: { "p_action": string,"p_metadata"?: Json,"p_target_id": string,"p_target_type": string }; Returns: undefined
                           }
          }
          Enums: {
            "app_role": "customer"|"business_owner"|"creator"|"admin","business_type": "restaurant"|"cafe"|"bakery"|"cloud_kitchen"|"catering"|"street_food"|"dessert"|"home_chef"|"other","diet_label": "veg"|"non_veg"|"egg"|"vegan"|"jain","export_format": "gif"|"png_sequence"|"webm"|"mp4"|"png","export_status": "queued"|"rendering"|"completed"|"failed"|"cancelled","inquiry_status": "new"|"read"|"replied"|"closed","member_role": "owner"|"manager"|"staff","order_status": "cart"|"placed"|"accepted"|"preparing"|"ready"|"out_for_delivery"|"delivered"|"cancelled"|"rejected","payment_mode": "sandbox"|"live","payment_status": "created"|"authorized"|"captured"|"failed"|"refunded","plan_code": "free_starter"|"creator"|"business_pro"|"enterprise","project_status": "draft"|"published"|"archived","report_status": "open"|"reviewing"|"actioned"|"dismissed","subscription_status": "active"|"trialing"|"past_due"|"cancelled"|"expired","verification_status": "unverified"|"pending"|"verified"|"rejected"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            "app_role": ["customer", "business_owner", "creator", "admin"],"business_type": ["restaurant", "cafe", "bakery", "cloud_kitchen", "catering", "street_food", "dessert", "home_chef", "other"],"diet_label": ["veg", "non_veg", "egg", "vegan", "jain"],"export_format": ["gif", "png_sequence", "webm", "mp4", "png"],"export_status": ["queued", "rendering", "completed", "failed", "cancelled"],"inquiry_status": ["new", "read", "replied", "closed"],"member_role": ["owner", "manager", "staff"],"order_status": ["cart", "placed", "accepted", "preparing", "ready", "out_for_delivery", "delivered", "cancelled", "rejected"],"payment_mode": ["sandbox", "live"],"payment_status": ["created", "authorized", "captured", "failed", "refunded"],"plan_code": ["free_starter", "creator", "business_pro", "enterprise"],"project_status": ["draft", "published", "archived"],"report_status": ["open", "reviewing", "actioned", "dismissed"],"subscription_status": ["active", "trialing", "past_due", "cancelled", "expired"],"verification_status": ["unverified", "pending", "verified", "rejected"]
          }
        }
} as const
