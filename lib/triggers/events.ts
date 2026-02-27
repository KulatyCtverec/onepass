import { prisma } from "@/lib/prisma";

export async function setupEventInsertTrigger() {
  //Create trigger for events
  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION notify_event_insert()
    RETURNS trigger AS $$
    DECLARE
      payload json;
    BEGIN
      payload := json_build_object(
        'type', 'create',
        'data', row_to_json(NEW)
      );
      PERFORM pg_notify(
        'events_channel',
        payload::text
      );
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // UPDATE trigger for events
  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION notify_event_update()
    RETURNS trigger AS $$
    DECLARE
      payload json;
    BEGIN
      payload := json_build_object(
        'type', 'update',
        'data', row_to_json(NEW)
      );
      PERFORM pg_notify(
        'events_channel',
        payload::text
      );
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // DELETE trigger for events
  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION notify_event_delete()
    RETURNS trigger AS $$
    DECLARE
      payload json;
    BEGIN
      payload := json_build_object(
        'type', 'delete',
        'data', row_to_json(OLD)
      );
      PERFORM pg_notify(
        'events_channel',
        payload::text
      );
      RETURN OLD;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await prisma.$executeRawUnsafe(
    `DROP TRIGGER IF EXISTS event_insert_trigger ON "Event";`
  );
  await prisma.$executeRawUnsafe(
    `DROP TRIGGER IF EXISTS event_update_trigger ON "Event";`
  );
  await prisma.$executeRawUnsafe(
    `DROP TRIGGER IF EXISTS event_delete_trigger ON "Event";`
  );

  // Create triggers
  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER event_insert_trigger
    AFTER INSERT ON "Event"
    FOR EACH ROW EXECUTE FUNCTION notify_event_insert();
  `);
  console.log("✅ Trigger 'event_insert_trigger' byl úspěšně nastaven.");

  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER event_update_trigger
    AFTER UPDATE ON "Event"
    FOR EACH ROW EXECUTE FUNCTION notify_event_update();
  `);
  console.log("✅ Trigger 'event_update_trigger' byl úspěšně nastaven.");

  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER event_delete_trigger
    AFTER DELETE ON "Event"
    FOR EACH ROW EXECUTE FUNCTION notify_event_delete();
  `);
  console.log("✅ Trigger 'event_delete_trigger' byl úspěšně nastaven.");
}

