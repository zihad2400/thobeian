import { NextResponse } from "next/server";

export function successResponse(data, message = "Success", status = 200) {
  return NextResponse.json(
    { success: true, message, data },
    { status }
  );
}

export function errorResponse(message = "Something went wrong", status = 400, errors = null) {
  return NextResponse.json(
    { success: false, message, errors },
    { status }
  );
}

export function createdResponse(data, message = "Created successfully") {
  return successResponse(data, message, 201);
}

export function noContentResponse() {
  return new NextResponse(null, { status: 204 });
}