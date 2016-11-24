package controllers

import play.api.mvc._

abstract class BaseController extends Controller {
  protected val doNotCachePage = Array(CACHE_CONTROL -> "no-cache, no-store")
}
